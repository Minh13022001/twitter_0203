export interface Article {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  source: {
    id: null;
    name: string;
  };
  title: string;
  url: string;
  urlToImage: string;
}

// export interface randomUsersResults {
//   info: object;
//   results: [];
// }

export interface randomUsersResults {
  login: {
    uuid: string;
    username: string;
    password: string;
  };
  name: {
    title: string;
    first: string;
    last: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}
