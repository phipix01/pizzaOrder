
//todo: lieferzeit z.b 12:30, inkl. MwSt /plz finder ort automatisch / rechnig überem price wo nomal zämefasst gruppieren(snacks pizzas döner getränke usw)
//test.grillhaus-mandoline.ch info@profotos.ch:admin123
Vue.config.debug = true;

Vue.filter('numberRepresentation', function (value) {
  //check if it's an integer
  if (typeof value==='number' && (value%1)===0) {
    return value+".-";
  }else if(typeof value==='number'){
    return value.toFixed(2);
  }
});

var userData ={
  tel:"",
  name:"",
  street:"",
  plz:"",
  place:""
};

var pizzas =[
  { title: 'Pizza mit Lieferung',
    ingredients: ['moz','tomato'],
    price:21,
  },
  { title: 'Pizza Margherita',
    ingredients: ['moz','tomato'],
    price:21
  },
  { title: 'Pizza Prosciutto',
    ingredients: ['moz','tomato','prosciutto','shroomz'],
    price:24.5
  },
  { title: 'Pizza Hawai',
    ingredients: ['Ananas','Cheese','prosciutto','Oregano'],
    price:24
  },
  { title: 'Pizza Calzone',
    ingredients: ['Artischocken','Cheese','prosciutto','Oregano'],
    price:24
  },
  { title: 'Pizza Raffaelo',
    ingredients: ['white chocolate','Cheese','prosciutto','Oregano'],
    price:24
  }
];

var vm = new Vue({
  el: '#pizzaOrder',
  data: {
    pizzas: pizzas,
    selectedPizza: this.pizzas[0] ,
    userData:userData
  },
  computed:{
    cartTotal: function () {
      var total = 0;
      //cheack all pizzas if they have a count prop and return count * price if they do so. else just retrun price
      this.pizzas.forEach(pizza => pizza.count ? total += pizza.count * pizza.price : 0);
      return total;
    }
  },
  methods: {
    addPizzaToCart: function (index) {
      if(this.pizzas[index].count){
        //For plain data objects, you can use the global Vue.set(object, key, value) method
        //http://vuejs.org/guide/reactivity.html
        Vue.set(this.pizzas[index], 'count', ++this.pizzas[index].count);
      }else {
        //declare count if not
        Vue.set(this.pizzas[index], 'count', 1);
      }
    },
    removePizzaFromCart: function (index) {
      //avoid count becoming a negativ value
      if (this.pizzas[index].count) {
        Vue.set(this.pizzas[index], 'count', --this.pizzas[index].count)
      }
    },
    updateLocalStorage: function (e) {
      //example <input name="street">
      var propName = e.target.name;
      if (this.userData[propName] === localStorage.getItem(propName)) {
      }else {
        localStorage.setItem(propName, this.userData[e.target.name]);
      }
    }
  },
  created:function () {
    //load userData from localStorage
    if (localStorageSupported()) {
      for(var prop in this.userData){
        this.userData[prop] = localStorage.getItem(prop);
      }
    }
  },
  ready:function () {
    //register eventhandler for the postal code lookup
    document.getElementById('postal').addEventListener('blur', function () {
      postalLookup(this.value);
    })
  }
})

function localStorageSupported() {
    var mod = 'modernizr';
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
        return false;
    }
};

function postalLookup(zip) {
  var request = new XMLHttpRequest();
  //credits to www.geonames.org
  request.open('GET', 'http://api.geonames.org/postalCodeLookupJSON?postalcode='+ zip +'&country=CH&username=demo', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      //if search was successful
      if (data.postalcodes.length) {
        document.getElementById('place').value = data.postalcodes[0].adminName3
      }
    } else {
      // We reached our target server, but it returned an error

    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
}
