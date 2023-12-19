if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Fetch meals from the API and return them
async function fetchMealsApi(url, value) {
    const response = await fetch(`${url}${value}`);
    const meals = await response.json();
    return meals;
}

// Show full meal details in a modal
async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    try {
        const data = await fetchMealsApi(url, id);

        // Extract ingredients and measurements from the data
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = data.meals[0][`strIngredient${i}`];
            const measurement = data.meals[0][`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== "") {
                ingredients.push(`${ingredient} - ${measurement}`);
            } else {
                break;
            }
        }

        // Construct the HTML for the modal
        let modalHtml = `
            <div class="modal fade" id="mealModal" tabindex="-1" aria-labelledby="mealModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="mealModalLabel">${data.meals[0].strMeal}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="d-flex justify-content-around flex-wrap">
                                <div id="meal-thumbail">
                                    <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
                                </div>
                                <div id="details">
                                    <h6>Category : ${data.meals[0].strCategory}</h6>
                                    <h6>Area : ${data.meals[0].strArea}</h6>
                                    <h5 class="text-center mt-3">Ingredients :</h5>
                                    <ul>${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
                                    <h5 class="text-center mt-3">Instruction :</h5>
                                    <p>${data.meals[0].strInstructions}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append the modal HTML to the body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show the modal
        const mealModal = new bootstrap.Modal(document.getElementById('mealModal'), {});
        mealModal.show();
    } catch (error) {
        console.error("Error fetching meal details:", error);
    }
}

// Show all meals card in main according to search input value
async function showMealList() {
    let inputValue = document.getElementById("my-search").value;
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    try {
        const data = await fetchMealsApi(url, inputValue);

        if (data.meals) {
            data.meals.forEach((element) => {
                html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                        <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${element.strMeal}</h5>
                            <div class="d-flex justify-content-between mt-5">
                                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="page-wrap d-flex flex-row align-items-center">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-12 text-center">
                                <span class="display-1 d-block">404</span>
                                <div class="mb-4 lead">
                                    The meal you are looking for was not found.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        document.getElementById("main").innerHTML = html;
    } catch (error) {
        console.error("Error fetching meals:", error);
    }
}

// Function to generate a random meal
async function generateRandomMeal() {
    let url = "https://www.themealdb.com/api/json/v1/1/random.php";
    try {
        const data = await fetchMealsApi(url, "");
        if (data.meals && data.meals.length > 0) {
            // Display the details of the random meal
            showMealDetails(data.meals[0].idMeal);
        } else {
            console.error("Error fetching random meal.");
        }
    } catch (error) {
        console.error("Error fetching random meal:", error);
    }
}

// Function to show details of a random meal
async function showRandomMealDetails() {
    let url = "https://www.themealdb.com/api/json/v1/1/random.php";
    try {
        const data = await fetchMealsApi(url, "");

        // Check if the data contains a meal
        if (data.meals && data.meals.length > 0) {
            const randomMealCard = document.getElementById('random-meal-card');
            const randomMealImage = document.getElementById('random-meal-image');
            const randomMealTitle = document.getElementById('random-meal-title');

            randomMealImage.src = data.meals[0].strMealThumb;
            randomMealTitle.textContent = data.meals[0].strMeal;

            // Display the details of the random meal
            showMealDetails(data.meals[0].idMeal);
        } else {
            console.error("Error fetching random meal.");
        }
    } catch (error) {
        console.error("Error fetching random meal:", error);
    }
}
document.addEventListener('DOMContentLoaded', showRandomMealDetails);





















