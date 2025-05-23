<template>
  <form>
    <div class="space-y-12">
      <div class="flex gap-2">
        <font-awesome-icon icon="fa-solid fa-cart-shopping" />
        <h1 class="text-2xl font-bold mb-4">Discount Calculator</h1>
      </div>
      <h2 class="text-base/7 font-semibold mt-4">Cart Items</h2>
    </div>
  </form>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">🛒 Discount Calculator</h1>
    <h2 class="font-semibold mt-4">Cart Items</h2>
    <div v-for="(item, index) in cart" :key="index" class="grid grid-cols-3 gap-2 mb-2">
      <div class="max-w-fit">
        <label class="flex items-center gap-2">Product Name</label>
        <input v-model="item.name" class="input" placeholder="Name" />
      </div>
      <div>
        <label class="flex items-center gap-2">Price</label>
        <input v-model.number="item.price" type="number" class="input" placeholder="Price" />
      </div>
      <div>
        <label class="flex items-center gap-2">Category</label>
        <select v-model="item.category" class="input">
          <option disabled value="">Select category</option>
          <option>Clothing</option>
          <option>Accessories</option>
          <option>Electronics</option>
        </select>
      </div>
    </div>
    <button class="btn" @click="addCartItem">+ Add Item</button>

    <h2 class="font-semibold mt-6">Campaigns</h2>
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-2">
        <label class="flex items-center gap-2">
          <input type="radio" v-model="couponType" value="FixedAmount" /> Fixed Amount
        </label>
        <input
          v-if="couponType === 'FixedAmount'"
          v-model.number="coupon.amount"
          type="number"
          class="input"
          placeholder="Amount"
        />

        <label class="flex items-center gap-2">
          <input type="radio" v-model="couponType" value="PercentageCoupon" /> Percentage
        </label>
        <input
          v-if="couponType === 'PercentageCoupon'"
          v-model.number="coupon.percentage"
          type="number"
          class="input"
          placeholder="%"
        />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <select v-model="categoryPercentage.category" class="input">
          <option disabled value="">Select category</option>
          <option>Clothing</option>
          <option>Accessories</option>
          <option>Electronics</option>
        </select>
        <input
          v-model.number="categoryPercentage.percentage"
          type="number"
          class="input"
          placeholder="% Off by Category"
        />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <label class="flex items-center gap-2">Use points (max 20%)</label>
        <input
          v-model.number="points.points"
          type="number"
          class="input"
          placeholder="Use points (max 20%)"
        />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <label class="flex items-center gap-2">Every X THB</label>
        <input
          v-model.number="seasonal.every"
          type="number"
          class="input"
          placeholder="Every X THB"
        />
        <label class="flex items-center gap-2">Discount Y THB</label>
        <input
          v-model.number="seasonal.discount"
          type="number"
          class="input"
          placeholder="Discount Y THB"
        />
      </div>
    </div>

    <button class="btn mt-4" @click="calculate">Calculate</button>

    <div v-if="result" class="mt-6 p-4 border rounded bg-green-50">
      <p><strong>Total Before:</strong> {{ result.totalBeforeDiscount }} THB</p>
      <p><strong>Total After:</strong> {{ result.totalAfterDiscount }} THB</p>
      <p><strong>Campaigns:</strong> {{ result.appliedCampaigns.join(', ') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

interface DiscountResult {
  totalBeforeDiscount: number
  totalAfterDiscount: number
  appliedCampaigns: string[]
}

const cart = ref([{ name: '', price: 0, category: '' }])
const couponType = ref('')
const coupon = ref({ amount: 0, percentage: 0 })
const categoryPercentage = ref({ category: '', percentage: 0 })
const points = ref({ points: 0 })
const seasonal = ref({ every: 0, discount: 0 })
const result = ref<DiscountResult | null>(null)

function addCartItem() {
  cart.value.push({ name: '', price: 0, category: '' })
}

async function calculate() {
  const campaigns = []
  if (couponType.value === 'FixedAmount' && coupon.value.amount) {
    campaigns.push({ type: 'FixedAmount', amount: coupon.value.amount })
  } else if (couponType.value === 'PercentageCoupon' && coupon.value.percentage) {
    campaigns.push({ type: 'PercentageCoupon', percentage: coupon.value.percentage })
  }
  if (categoryPercentage.value.category && categoryPercentage.value.percentage) {
    campaigns.push({
      type: 'CategoryPercentage',
      category: categoryPercentage.value.category,
      percentage: categoryPercentage.value.percentage,
    })
  }
  if (points.value.points) {
    campaigns.push({ type: 'Points', points: points.value.points })
  }
  if (seasonal.value.every && seasonal.value.discount) {
    campaigns.push({
      type: 'Seasonal',
      every: seasonal.value.every,
      discount: seasonal.value.discount,
    })
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/discount/calculate`, {
      cart: cart.value,
      campaigns,
    })
    result.value = response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || error.message)
    } else if (error instanceof Error) {
      alert(error.message)
    } else {
      alert('Unknown error occurred')
    }
  }
}
</script>

<style scoped>
.input {
  @apply border rounded p-2 w-full;
}
.btn {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
</style>
