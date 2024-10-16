import { AuthService } from "./auth.service";
import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";

export const AuthGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const service = inject(AuthService);

  // const statePromise = new Promise((resolve) => {
  //   service.getAuthState.subscribe(async state => {
  //     resolve(state)
  //   });
  // })

  const token = localStorage.getItem("auth_token");
  if (token && token.length) {
    return true;
  } else {
    await router.navigateByUrl('auth', {replaceUrl: true});
    return false;
  }
};
