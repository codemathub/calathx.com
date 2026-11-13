const mongoose = require('mongoose');
require('dotenv').config({ path: 'server/.env' });

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in server/.env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  require('../server/src/models/Category');
  const Category = mongoose.model('Category');
  const Post = require('../server/src/models/Post');

  const videoCat = await Category.findOne({ slug: 'video-tutorials' });
  console.log('Video category:', videoCat?._id);

  // Set real high-quality fitness/workout videos for a few posts
  const sampleVideos = [
    {
      slug: 'ultimate-14-weeks-full-body-hiit-workout-plan',
      videoUrl: 'https://www.youtube.com/watch?v=cbKkB3POqaY', // HIIT workout
      isFeatured: true,
    },
    {
      slug: 'workout-plan-for-beginners',
      videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4', // Beginner workout
      isFeatured: true,
    },
    {
      slug: 'calisthenics-for-beginners-best-exercises-you-should-know',
      videoUrl: 'https://www.youtube.com/watch?v=yW6a8V9B7nE', // Calisthenics beginner
      isFeatured: true,
    },
    {
      slug: 'best-yoga-poses-for-kids',
      videoUrl: 'https://www.youtube.com/watch?v=X655B4ISakg', // Yoga flow
      isFeatured: true,
    },
    {
      slug: 'effective-back-posture-exercises',
      videoUrl: 'https://www.youtube.com/watch?v=RqcOCBb4arc', // Back posture
      isFeatured: false,
    },
  ];

  for (const item of sampleVideos) {
    const post = await Post.findOne({ slug: item.slug });
    if (post) {
      post.videoUrl = item.videoUrl;
      post.isFeatured = item.isFeatured;
      if (videoCat && !post.categories.includes(videoCat._id)) {
        post.categories.push(videoCat._id);
      }
      await post.save();
      console.log(`Updated video and featured for: ${post.title}`);
    }
  }

  // Also set a couple featured posts in other categories
  const otherFeaturedSlugs = [
    'the-9-best-diet-plans-for-your-overall-health', // Nutrition
    '15-potassium-rich-foods-that-pack-more-than-a-banana', // Nutrition
    'review-bioxyn-best-weight-loss-supplement', // Fuel
    'human-growth-hormone-hgh-side-effects-and-myth-about-hgh-gut-palumboism', // Fuel
    '9-ways-in-10-minutes-to-improve-your-health-substantially', // Health A-Z
    'top-benefits-of-ashwagandha', // Health A-Z
  ];

  for (const slug of otherFeaturedSlugs) {
    const p = await Post.findOne({ slug });
    if (p) {
      p.isFeatured = true;
      await p.save();
      console.log(`Marked featured: ${p.title}`);
    }
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

