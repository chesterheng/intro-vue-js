var eventBus = new Vue();

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
    <div>
      <span class="tab"
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs" 
            :key="index"
            @click="selectedTab = tab">
            {{ tab }}
            </span>

      <div v-show="selectedTab === 'Reviews'">
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="(review, index) in reviews" :key="index">
            <p>Name: {{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>Review: {{ review.review }}</p>
            <p>Recommend: {{ review.recommend }}</p>
          </li>
        </ul>
      </div>

      <product-review 
        v-show="selectedTab === 'Make a Review'">
      </product-review>  
    
    </div>



  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    };
  }
});

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="(error, index) in errors" :key="index">
            {{ error }}
          </li>
        </ul>
      </p>
      
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option value="5" selected>5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </p>
    
      <p>Would you recommend this product?</p>
      <label>
        Yes
        <input type="radio" value="Yes" v-model="recommend"/>
      </label>
      <label>
        No
        <input type="radio" value="No" v-model="recommend"/>
      </label>

      <p>
        <input type="submit" value="submit">
      </p>

    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        };
        eventBus.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        this.errors = [];
        if (!this.name) this.errors.push('Name required');
        if (!this.review) this.errors.push('Review required');
        if (!this.rating) this.errors.push('Rating required');
        if (!this.recommend) this.errors.push('Recommend required');
      }
    }
  }
});

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
    </ul>
  `
});

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
  <div class="product">
    
    <div class="product-image">
      <img :src="image" v-bind:href="link">
    </div>
    
    <div class="product-info">
      <h1>{{ title }}</h1>

      <p v-if="inStock">In Stock</p>
      <p v-else :class="{ outOfStock: !inStock}">Out of Stock</p>
      <p>{{ sale }}</p>
      <p>User is premium: {{ premium }} </p>
      <p>Shipping : {{ shipping }} </p>

      <h2>Details</h2>
      <product-details :details="details"></product-details>

      <ul>
        <li v-for="(size, index) in sizes" :key="index">{{ size }}</li>
      </ul>

      <h3>Colors:</h3>
      <div class="color-box"
        v-for="(variant, index) in variants" :key="variant.variantId"
        :style="{ backgroundColor: variant.variantColor}" @mouseover="updateProduct(index)">
          <p>{{ variant.variantColor }}</p>
      </div>

      <p>{{ description }}</p>
      <a :href="link" target="_blank">More products like this</a>

      <button 
        @click="addToCart" 
        :disabled="!inStock" 
        :class="{ disabledButton: !inStock }">Add to Cart
      </button>

      <button 
        @click='removeFromCart'
        :disabled="!inStock"
        :class="{ disabledButton: !inStock }">Remove from Cart
      </button>
    </div>
    
    <product-tabs :reviews="reviews"></product-tabs>

  </div>
  `,
  data() {
    return {
      product: 'Socks',
      brand: 'Vue mastery',
      description: 'A pair of warm, fuzzy socks',
      //image: './assets/vmSocks-green.jpg',
      selectedVariant: 0,
      link:
        'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
      //inStock: false,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: './assets/vmSocks-green.jpg',
          variantQuantity: 5
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: './assets/vmSocks-blue.jpg',
          variantQuantity: 5
        }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      //cart: 0,
      onSale: true,
      reviews: []
    };
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        'remove-from-cart',
        this.variants[this.selectedVariant].variantId
      );
      t;
    },
    updateProduct(index) {
      this.selectedVariant = index;
      console.log(index);
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) return this.brand + ' ' + this.product + ' are on sale!';
      else return this.brand + ' ' + this.product + ' are not on sale!';
    },
    shipping() {
      if (this.premium) return 'Free';
      else return 2.99;
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    });
  }
});

var app = new Vue({
  el: '#app',
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeCart(id) {
      this.cart = this.cart.filter(el => el != id);
    }
  }
});
