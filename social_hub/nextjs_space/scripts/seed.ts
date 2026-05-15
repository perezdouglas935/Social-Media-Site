import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const AVATARS = {
  kerry: "https://cdn.abacus.ai/images/c92911bf-6397-4717-bbc6-de788c6c7c16.png",
  devon: "https://cdn.abacus.ai/images/7a85bb4a-a64a-4fc0-9b51-1a01313902cf.png",
  celia: "https://cdn.abacus.ai/images/a372ef26-7e2b-4f13-95bb-c9aa8b9e4de7.png",
  raj: "https://cdn.abacus.ai/images/9f4c4a6e-8e36-408f-b4e8-59dd2d48c151.png",
  lina: "https://cdn.abacus.ai/images/4b8c9ba1-7c44-4b32-aeff-52f4b2c1633a.png",
  david: "https://cdn.abacus.ai/images/4f9d1ccf-a0fc-4610-a98f-cd809a8a2058.png",
  bea: "https://cdn.abacus.ai/images/ae70d313-3a11-4455-b5dc-547f76f530bc.png",
  marco: "https://cdn.abacus.ai/images/7e501df1-0664-4579-b188-30df2f4a60f2.png",
  sophie: "https://cdn.abacus.ai/images/8e5a9e91-6743-4462-83f1-2f77bc5ec4b5.png",
  tomo: "https://cdn.abacus.ai/images/3e015c4b-ee9d-4264-849a-7f95dce92813.png",
};

const POST_IMAGES = {
  purple_orb: "https://cdn.abacus.ai/images/7eabe9ef-d43d-40a5-a947-f71281d3c778.png",
  workspace: "https://cdn.abacus.ai/images/1e9ad8d4-d0d0-49c0-85b3-156047df1bbc.png",
  city_night: "https://cdn.abacus.ai/images/b2fc06c1-728b-4992-859b-a2aa45348e54.png",
  food_brunch: "https://cdn.abacus.ai/images/d7f2ee73-8d23-47d3-b078-289783c11de9.png",
};

const USERS = [
  {
    username: "kerrymelton",
    displayName: "Kerry Melton",
    bio: "Full-stack engineer · Building things that ship · Coffee enthusiast ☕",
    avatarUrl: AVATARS.kerry,
    location: "Brooklyn, NY",
    website: "kerry.dev",
    isVerified: true,
  },
  {
    username: "devondesigns",
    displayName: "Devon Carter",
    bio: "Product designer @ Stripe. I draw rectangles for a living.",
    avatarUrl: AVATARS.devon,
    location: "San Francisco, CA",
    isVerified: true,
  },
  {
    username: "celiamiranda",
    displayName: "Celia Miranda",
    bio: "Painter, illustrator, and lover of late-night studio sessions 🎨",
    avatarUrl: AVATARS.celia,
    location: "Mexico City",
  },
  {
    username: "rajbuilds",
    displayName: "Raj Bakshi",
    bio: "Founder @ Loop · Previously @ Airbnb · Writing about startups & systems.",
    avatarUrl: AVATARS.raj,
    location: "Bangalore",
    website: "rajbuilds.com",
    isVerified: true,
  },
  {
    username: "linakim",
    displayName: "Lina Kim",
    bio: "Creative director · Brand strategist · Tea > coffee 🍵",
    avatarUrl: AVATARS.lina,
    location: "Seoul",
  },
  {
    username: "davidwhalen",
    displayName: "David Whalen",
    bio: "Writer covering tech, culture, and the in-between. Newsletter twice a week.",
    avatarUrl: AVATARS.david,
    location: "London",
    isVerified: true,
  },
  {
    username: "beachenue",
    displayName: "Bea Chenue",
    bio: "Software engineer turned indie hacker · Currently shipping micro-SaaS",
    avatarUrl: AVATARS.bea,
    location: "Lagos",
  },
  {
    username: "marcoreyes",
    displayName: "Marco Reyes",
    bio: "Photographer + creative technologist. Light is everything.",
    avatarUrl: AVATARS.marco,
    location: "Barcelona",
  },
  {
    username: "sophiehaze",
    displayName: "Sophie Haze",
    bio: "UX research lead. I ask the questions everyone forgot to ask.",
    avatarUrl: AVATARS.sophie,
    location: "Dublin",
  },
  {
    username: "tomotanaka",
    displayName: "Tomo Tanaka",
    bio: "Frontend dev, ramen connoisseur, weekend cyclist 🚴",
    avatarUrl: AVATARS.tomo,
    location: "Tokyo",
  },
];

// Each post: { author, content, imageKey?, parentIdx?, retweetIdx? }
const POSTS: Array<{
  author: string;
  content: string;
  image?: keyof typeof POST_IMAGES;
  parentIdx?: number;
}> = [
  // top-level posts (idx 0..)
  {
    author: "kerrymelton",
    content:
      "Just shipped a major update to our internal design system. 47 new components, fully accessible, dark-mode-first. The team is buzzing. #design #engineering",
  },
  {
    author: "devondesigns",
    content:
      "Hot take: most product teams ship features 2x faster the moment they delete their roadmap and start solving one problem at a time. #product",
  },
  {
    author: "celiamiranda",
    content:
      "Spent the morning playing with violet gradients. Something about this color makes everything feel cinematic.",
    image: "purple_orb",
  },
  {
    author: "rajbuilds",
    content:
      "Reminder: your first 100 users matter more than your next 10,000. Talk to every single one. Read every email. Reply personally. #startups",
  },
  {
    author: "linakim",
    content:
      "Brand isn't your logo. Brand isn't your color palette. Brand is the feeling someone gets when they see your work and immediately know it's yours.",
  },
  {
    author: "davidwhalen",
    content:
      "New essay is up: 'The quiet renaissance of long-form writing on the internet.' Link in bio. Spoiler: it never actually went away. #writing",
  },
  {
    author: "beachenue",
    content:
      "Day 14 of building in public. Revenue: $312 MRR. Lessons learned: pricing is a feature, not an afterthought. #buildinpublic #indiehackers",
  },
  {
    author: "marcoreyes",
    content:
      "Caught this just before sunset. Sometimes the city does the work for you — you just have to be there to press the shutter.",
    image: "city_night",
  },
  {
    author: "sophiehaze",
    content:
      "Conducted 8 user interviews this week. The thing people complain about loudest is rarely the thing actually blocking them. Listen for the quiet stuff.",
  },
  {
    author: "tomotanaka",
    content:
      "My current setup. Minimal, mostly. The plant is the only one I haven't killed. #workspace",
    image: "workspace",
  },
  {
    author: "kerrymelton",
    content:
      "TypeScript tip: prefer `satisfies` over `as` whenever you can. You keep the literal types and gain compile-time safety. Game changer. #typescript",
  },
  {
    author: "celiamiranda",
    content:
      "Sunday brunch ritual. Avocado on sourdough, double espresso, no notifications. Highly recommend. 🥑☕",
    image: "food_brunch",
  },
  {
    author: "devondesigns",
    content:
      "Just discovered that our checkout flow drops 12% of users at a single tooltip. Twelve. Percent. From a tooltip. Test your microcopy. #ux",
  },
  {
    author: "rajbuilds",
    content:
      "Hiring our 4th engineer this week. The bar isn't 'can they code' — the bar is 'do they make the room better'. #hiring",
  },
  {
    author: "linakim",
    content:
      "If your homepage tries to say five things, it ends up saying nothing. Pick one. Say it loudly. Everything else can wait. #branding",
  },
  {
    author: "davidwhalen",
    content:
      "The strangest thing about working from home for 6 years: I forgot how loud open offices actually are. Spent a day in one yesterday. Lord.",
  },
  {
    author: "beachenue",
    content:
      "Marketing is just leverage on a product that already works. If the product doesn't work, marketing makes the leak bigger, faster.",
  },
  {
    author: "tomotanaka",
    content:
      "React 19's compiler quietly removed the need for 80% of my useMemo calls. The future is auto-optimization. #react #frontend",
  },
  {
    author: "sophiehaze",
    content:
      "Research isn't 'what feature should we build next.' It's 'what truth about our users are we currently ignoring.' Different question, different answers.",
  },
  {
    author: "marcoreyes",
    content:
      "Bought my first film camera in 12 years. Already shot through 3 rolls. There's something about the friction of 36 frames that changes how you see.",
  },
  // replies
  {
    author: "devondesigns",
    content:
      "This is a great point. Most 'new feature' debates would dissolve if we ran 5 user interviews first. #ux",
    parentIdx: 1,
  },
  {
    author: "linakim",
    content: "Counterpoint: sometimes you have to ship the rough version to learn what the right version even is.",
    parentIdx: 1,
  },
  {
    author: "rajbuilds",
    content: "This. We onboard every customer over a 30-min call for the first 6 months. Painful but irreplaceable.",
    parentIdx: 3,
  },
  {
    author: "kerrymelton",
    content: "At what point did you start automating it? Genuinely curious where the cliff is.",
    parentIdx: 3,
  },
  {
    author: "celiamiranda",
    content: "This palette is unreal. What did you use to render it?",
    parentIdx: 2,
  },
  {
    author: "marcoreyes",
    content: "Insane shot. The way the lights bend off the wet pavement.",
    parentIdx: 7,
  },
  {
    author: "sophiehaze",
    content:
      "You'd be amazed how often I show stakeholders this in research debriefs and they go 'wait, that's it?' Yes. That's it. The boring stuff is the gold. #research",
    parentIdx: 8,
  },
  {
    author: "davidwhalen",
    content: "Plant flex aside, that monitor placement is criminal on your neck. Get it up, friend.",
    parentIdx: 9,
  },
  {
    author: "tomotanaka",
    content: "Fair, fair. Riser incoming this weekend.",
    parentIdx: 27, // reply to David's reply
  },
  {
    author: "beachenue",
    content: "Love the discipline of the no-notifications brunch. I want to be this person. #goals",
    parentIdx: 11,
  },
  {
    author: "kerrymelton",
    content: "`satisfies` literally changed how I write config files. No more wrong-shape errors at 2am.",
    parentIdx: 10,
  },
  {
    author: "rajbuilds",
    content:
      "Counterintuitive truth: shipping slower in week 1 saves you weeks 4-8. Foundation work compounds. #engineering",
  },
  {
    author: "linakim",
    content:
      "A logo redesign won't fix a brand problem. It just makes the brand problem more expensive.",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Upsert users
  const userMap = new Map<string, string>();
  for (const u of USERS) {
    const created = await prisma.user.upsert({
      where: { username: u.username },
      create: u,
      update: u,
    });
    userMap.set(u.username, created.id);
  }
  console.log(`✅ ${USERS.length} users upserted`);

  // Idempotent: skip post-graph seeding if posts already exist.
  const existingPostsCount = await prisma.post.count();
  if (existingPostsCount > 0) {
    console.log(
      `\u23ed\ufe0f  ${existingPostsCount} posts already exist in DB \u2014 skipping post/like/retweet/notification seeding to preserve user data.`,
    );
    console.log("\ud83c\udf89 Seed complete!");
    return;
  }

  // Stagger createdAt — newest posts first in the array slot, but we'll iterate as if oldest first
  const postIds: string[] = [];
  const now = Date.now();
  for (let i = 0; i < POSTS.length; i++) {
    const p = POSTS[i];
    const authorId = userMap.get(p.author)!;
    // older posts have smaller (more negative) offset; newer posts (later in array) more recent
    // Simulate: index 0 is ~30h ago, last index ~5min ago
    const minutesAgo = Math.max(5, 30 * 60 - i * 50);
    const createdAt = new Date(now - minutesAgo * 60 * 1000);
    const post = await prisma.post.create({
      data: {
        authorId,
        content: p.content,
        imageUrl: p.image ? POST_IMAGES[p.image] : null,
        parentId: p.parentIdx !== undefined ? postIds[p.parentIdx] : null,
        createdAt,
      },
    });
    postIds.push(post.id);

    // hashtags
    const tags = (p.content.match(/#[a-zA-Z0-9_]+/g) ?? []).map((t) => t.toLowerCase().slice(1));
    for (const tag of Array.from(new Set(tags))) {
      const ht = await prisma.hashtag.upsert({
        where: { tag },
        create: { tag },
        update: {},
      });
      await prisma.postHashtag.create({
        data: { postId: post.id, hashtagId: ht.id },
      });
    }
  }
  console.log(`✅ ${POSTS.length} posts created`);

  // Likes — random spread
  const allUserIds = Array.from(userMap.values());
  for (const postId of postIds) {
    const numLikes = Math.floor(Math.random() * 8) + 1;
    const shuffled = [...allUserIds].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numLikes && i < shuffled.length; i++) {
      try {
        await prisma.like.create({ data: { userId: shuffled[i], postId } });
      } catch {
        // ignore dup
      }
    }
  }
  console.log(`✅ Likes seeded`);

  // Retweets — sparser
  for (const postId of postIds.slice(0, 15)) {
    const numRT = Math.floor(Math.random() * 3);
    const shuffled = [...allUserIds].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numRT; i++) {
      try {
        await prisma.retweet.create({ data: { userId: shuffled[i], postId } });
      } catch {}
    }
  }
  console.log(`✅ Retweets seeded`);

  // Follows — each user follows 3-6 others
  for (const followerId of allUserIds) {
    const others = allUserIds.filter((id) => id !== followerId);
    const num = Math.floor(Math.random() * 4) + 3;
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, num);
    for (const followingId of shuffled) {
      try {
        await prisma.follow.create({ data: { followerId, followingId } });
      } catch {}
    }
  }
  console.log(`✅ Follows seeded`);

  // Notifications — give the first user a few notifications from various others
  const kerryId = userMap.get("kerrymelton")!;
  const samplePost = postIds[0];
  const notifActors = allUserIds.filter((id) => id !== kerryId).slice(0, 6);
  const notifTypes = ["LIKE", "RETWEET", "REPLY", "FOLLOW", "LIKE", "FOLLOW"] as const;
  for (let i = 0; i < notifActors.length; i++) {
    await prisma.notification.create({
      data: {
        userId: kerryId,
        actorId: notifActors[i],
        type: notifTypes[i],
        postId: notifTypes[i] === "FOLLOW" ? null : samplePost,
        createdAt: new Date(now - i * 60 * 60 * 1000),
      },
    });
  }
  console.log(`✅ Notifications seeded`);

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
