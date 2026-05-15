export type ApiUser = {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl?: string | null;
  isDemo: boolean;
  isVerified: boolean;
  location?: string | null;
  website?: string | null;
  createdAt?: string;
};

export type ApiPost = {
  id: string;
  content: string;
  imageUrl: string | null;
  parentId: string | null;
  createdAt: string;
  author: ApiUser;
  parent?: ApiPostLite | null;
  counts: {
    likes: number;
    retweets: number;
    bookmarks: number;
    replies: number;
  };
  viewer: {
    liked: boolean;
    retweeted: boolean;
    bookmarked: boolean;
  };
};

export type ApiPostLite = {
  id: string;
  author: { username: string; displayName: string; avatarUrl: string | null };
};

export type ApiUserWithCounts = ApiUser & {
  followerCount: number;
  followingCount: number;
  postCount: number;
  isFollowing: boolean;
  isMe: boolean;
};
