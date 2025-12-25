/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * Get Notifications List Route
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getNotificationsListRouteApiNotificationsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications/',
        });
    }
    /**
     * Read Notification Route
     * @param notificationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readNotificationRouteApiNotificationsNotificationIdReadPost(
        notificationId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/{notification_id}/read',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read All Notifications Route
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readAllNotificationsRouteApiNotificationsReadAllPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/read-all',
        });
    }
}
