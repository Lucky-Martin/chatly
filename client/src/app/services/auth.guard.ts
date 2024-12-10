import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { IUser } from "../models/IUser";

export const AuthGuard: CanActivateFn = async () => {
  const router = inject(Router);

  const token: string | null = localStorage.getItem("auth_token");
  const userJSON: string | null = localStorage.getItem("user-json");
  if (userJSON) {
    const user: IUser | null = JSON.parse(userJSON).user as IUser;

    if (user && user.interests.length < 3) {
      await router.navigateByUrl('auth/interests', {replaceUrl: true});
      return false;
    }
  } else {
    return false;
  }

  if (token && token.length) {
    return true;
  } else {
    await router.navigateByUrl('auth/login', {replaceUrl: true});
    return false;
  }
};
