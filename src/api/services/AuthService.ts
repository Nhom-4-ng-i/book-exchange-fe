/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SignInRequest } from '../models/SignInRequest';
import type { SignInResponse } from '../models/SignInResponse';
import type { SignUpRequest } from '../models/SignUpRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Sign Up Route
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static signUpRouteApiAuthSignUpPost(
        requestBody: SignUpRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/sign-up',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Sign In Route
     * @param requestBody
     * @returns SignInResponse Successful Response
     * @throws ApiError
     */
    public static signInRouteApiAuthSignInPost(
        requestBody: SignInRequest,
    ): CancelablePromise<SignInResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/sign-in',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Sign Out Route
     * @returns any Successful Response
     * @throws ApiError
     */
    public static signOutRouteApiAuthSignOutPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/sign-out',
        });
    }
}
