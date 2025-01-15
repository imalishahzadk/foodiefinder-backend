const fs = require('fs');

// Load the dataset
const filePath = './dataset.json';
let data;

// Function to get a random price value
const getRandomPrice = () => {
  const prices = ["$", "$$", "$$$", "$$$$", "$$$$$"];
  return prices[Math.floor(Math.random() * prices.length)];
};

// Function to update the price of each restaurant record
const updatePrices = (data) => {
  return data.map((record) => {
    // Generate a new random price
    const newPrice = getRandomPrice();

    // Update or add the price entry
    record.price = newPrice;

    return record;
  });
};

try {
  // Read the JSON file
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  data = JSON.parse(jsonData);

  // Update the prices
  const updatedData = updatePrices(data);

  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
  console.log('Prices updated successfully!');
} catch (error) {
  console.error('Error processing the file:', error);
}
