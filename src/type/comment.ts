import { Timestamp } from "firebase/firestore";

  
export interface CommentType {
  comment: string;
  name: string;
  timestamp: Timestamp;
  userId: string;
  userImg: string;
  username: string;
}






