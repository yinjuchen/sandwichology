const apiID = '50fe9d77'
const apiKey = '3bfc40a872e03c77029e146fcb6250f0'
const recipeName = 'sandwic'
const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${recipeName}&app_id=${apiID}&app_key=${apiKey}&page=15`


// Defind DOM
const main = document.querySelector('.main-container')
const search = document.getElementById('searchInput')
const entryPage = document.getElementById('entryPage')
const buttonContainer = document.getElementById('categoryButtons')

// array to store data 
let resultArray = []
// array to store filter sandwich
let allSandwiches = []

// loader
window.addEventListener('load', function () {
  this.setTimeout(() => {
    entryPage.style.display = 'none'
  }, 2000)
})

// degine category keywords for buttons
const categories =
  [
    "Cheese",
    "Muffin",
    "Panini",
    "Chicken",
    "Spinach",
    "Peanut Butter",
    "Bacon",
    "Potato",
    "Garlic",
    "Avocado",
    "Corn Cake",
    "Breakfast"
  ]

// function for creating the button 
function createButton(category) {
  // create button element
  const button = document.createElement('button')
  // set button category
  button.textContent = category
  button.addEventListener('click', () => {
    // call searchSandwiches function by category 
    searchSandwiches(category)
    // console.log("Filtering for:", category)
  })
  // return the created button 
  return button
}

// loop through categories to create buttons
// Each time createButton(category) is called, it creates a new button for that category, and this button is stored in the button variable before being appended to the container.
categories.forEach(category => {
  const button = createButton(category)
  buttonContainer.appendChild(button)
})

// Function to show all sandwiches and hide back button
function showAllSandwiches() {
  updateDoM(allSandwiches); // Resets the view to show all items
  document.getElementById('backButtonContainer').style.display = 'none' // Hide back button
}

// build DOM based on filterredSandWiches
function updateDoM(filterredSandWiches) {
  // Remove all previous sandwiches
  main.innerHTML = ''

  // Determine if a filter has been applied
  const isFiltered = filterredSandWiches.length !== allSandwiches.length

  // Show or hide the back button based on whether a filter is applied
  document.getElementById('backButtonContainer').style.display = isFiltered ? 'block' : 'none'

  // check if the filterredSandWiches.length === 0
  if (filterredSandWiches.length === 0) {
    const noResultsMsg = document.createElement('div')
    noResultsMsg.textContent = 'No results found'
    noResultsMsg.classList.add('no-results')
    main.appendChild(noResultsMsg)
  } else {
    filterredSandWiches.forEach(sandwich => {

      // section
      const section = document.createElement('section')
      section.classList.add('sandwich-section')

      // sandwich card 
      const sandwichCardHolder = document.createElement('div')
      sandwichCardHolder.classList.add('sandwich-card-holder')

      // image
      const image = document.createElement('img')
      image.src = sandwich.recipe.image
      image.alt = sandwich.recipe.label

      // review placeholder 
      const reviewContainer = document.createElement('div')
      reviewContainer.classList.add('fa-container')

      // review section 
      for (let i = 0; i < 5; i++) {
        const reviewSection = document.createElement('i')
        reviewSection.classList.add('fa', 'fa-smile-o');

        (function (index, parentCard) {
          reviewSection.addEventListener('click', function () {
            handleRatingClick(index + 1, parentCard)
          })
        })(i, sandwichCardHolder)

        reviewContainer.appendChild(reviewSection)
      }

      function handleRatingClick(rating, parentCard) {
        const reviewIcons = parentCard.querySelectorAll('.fa-smile-o')

        if (rating === 1) {
          if (reviewIcons[0].classList.contains('selected') && !reviewIcons[1].classList.contains('selected')) {
            reviewIcons[0].classList.remove('selected')
            return
          }
        }

        reviewIcons.forEach((icon, index) => {
          if (index < rating) {
            icon.classList.add('selected')
          } else {
            icon.classList.remove('selected')
          }
        })
      }

      // share by email section 
      const shareByEmail = document.createElement('i')
      shareByEmail.classList.add('fa', 'fa-paper-plane-o')

      shareByEmail.addEventListener('click', function () {
        // email subject
        const subject = encodeURIComponent('Check out this recipe: ' + sandwich.recipe.label)
        // email body 
        const body = encodeURIComponent("I found this great recipe and thought you might like it!" + "\n\n" +
          "Recipt: " + sandwich.recipe.label + "\n" +
          "Link: " + sandwich.recipe.url + "\n\n" +
          "Enjoy Cooking!"
        )
        const mailtoLink = `mailto:?subject=${subject}&body=${body}`
        window.open(mailtoLink, '_blank')
      })

      // receipt preview container
      const receiptPreviewContainer = document.createElement('div')
      receiptPreviewContainer.classList.add('receipt-preview-container')

      // label 
      const label = document.createElement('span')
      label.textContent = sandwich.recipe.label
      label.classList.add('label-name')

      // yield 
      const yield = document.createElement('span')
      yield.textContent = `Serve: ${sandwich.recipe.yield}`

      // calories
      const calories = document.createElement('span')
      calories.textContent = `Calories: ${sandwich.recipe.calories.toFixed(0)}`

      // receipt content container 
      const reciptContentContainer = document.createElement('div')
      reciptContentContainer.classList.add('recipt-content-container')

      // ingredients 
      const ingredientsList = document.createElement('ul')
      // use map to loop through item in the item of ingredients array
      sandwich.recipe.ingredients.map(ingredient => {
        const ingredientsItems = document.createElement('li')
        const ingredientsText = `${ingredient.text} Quantity: ${ingredient.quantity} ${ingredient.measure}`
        ingredientsItems.textContent = ingredientsText
        ingredientsList.appendChild(ingredientsItems)
      })

      // Toggle button for ingredients
      const toggleIngredientsBtn = document.createElement('button')
      toggleIngredientsBtn.textContent = 'Show Ingredients'
      toggleIngredientsBtn.classList.add('toggle-ingredients-btn')

      // Initially hide the ingredients list
      ingredientsList.style.display = 'none'
      toggleIngredientsBtn.addEventListener('click', function () {
        if (ingredientsList.style.display === 'none') {
          ingredientsList.style.display = 'block'
          toggleIngredientsBtn.textContent = 'Hide Ingredients'
        } else {
          ingredientsList.style.display = 'none'
          toggleIngredientsBtn.textContent = 'Show Ingredients'
        }
      })

      // append 
      section.append(sandwichCardHolder)
      sandwichCardHolder.append(image, reviewContainer, receiptPreviewContainer, reciptContentContainer, toggleIngredientsBtn)
      reviewContainer.appendChild(shareByEmail)
      reciptContentContainer.append(toggleIngredientsBtn, ingredientsList);
      // reciptContentContainer.appendChild( ingredientsList)
      receiptPreviewContainer.append(label, yield, calories)
      // sandwichDetails.appendChild(section)
      // console.log(section)
      main.appendChild(section)
    })
  }
}

// Function to handle both searching and resetting the list
function handleSearchInput(e) {
  const searchTerm = e.target.value // Get the current value of the input
  if (searchTerm.trim() === '') {
    // If the input is empty, show all sandwiches
    updateDoM(allSandwiches)
  } else {
    // Otherwise, perform a search
    searchSandwiches(searchTerm)
  }
}

// Attach the event listener to handle both input and clearing
search.addEventListener('input', handleSearchInput);

// search function 
function searchSandwiches(searchTerm) {
  const filteredSandwiches = allSandwiches.filter(sandwich => {
    return sandwich.recipe.label.toLowerCase().includes(searchTerm.toLowerCase());
  })
  updateDoM(filteredSandwiches)
}

// function to retrieve sandwich information 
async function getSandwich() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    resultArray = data.hits
    allSandwiches = resultArray // set for searching
    updateDoM(resultArray) // initial display
  } catch (error) {
    console.error(error);
  }
}

getSandwich()
