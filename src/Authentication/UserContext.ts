import { createContext } from "react";
import { User } from "firebase";

export default createContext<User | undefined>(undefined);
