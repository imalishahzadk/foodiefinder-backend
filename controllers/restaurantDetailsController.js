exports.getRestaurantDetails = (req, res) => {
  const restaurant = dataset.find((r) => r.placeId === req.params.id);

  if (!restaurant) {
    return res.status(404).send({ error: "Restaurant not found" });
  }

  // Include images from reviews
  const reviewsWithImages = restaurant.reviews.map((review) => ({
    ...review,
    reviewImageUrls: review.reviewImageUrls || [], // Ensure we include an empty array if no images
  }));

  // Include all necessary fields in the response
  res.json({
    success: true,
    data: {
      title: restaurant.title,
      address: restaurant.address,
      neighborhood: restaurant.neighborhood,
      city: restaurant.city,
      state: restaurant.state,
      countryCode: restaurant.countryCode,
      categoryName: restaurant.categoryName,
      totalScore: restaurant.totalScore,
      reviewsCount: restaurant.reviewsCount,
      permanentlyClosed: restaurant.permanentlyClosed,
      phone: restaurant.phone,
      website: restaurant.website,
      imageUrl: restaurant.imageUrl,
      reviews: reviewsWithImages,
    },
  });
};
