import { type Type, applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, type ApiResponseOptions, getSchemaPath } from '@nestjs/swagger'
import { ApiResponse as APIResponse, ListQueryResult } from '../dto'

type ApplyDecoratorsReturnType = ReturnType<typeof applyDecorators>

/**
 * A decorator to standardize API responses.
 *
 * @template TDto - The type of the data transfer object (DTO) to be included in the response.
 * @param {TDto} dataDto - The DTO class to be used in the response.
 * @param {ApiResponseOptions} [options] - The options to be passed to the `ApiResponse` decorator.
 * @returns {ApplyDecoratorsReturnType} - The combined decorators to be applied.
 */
export function NBApiResponse<TDto extends Type<unknown>>(dataDto: TDto, options?: ApiResponseOptions): ApplyDecoratorsReturnType {
  return applyDecorators(
    ApiExtraModels(APIResponse, dataDto),
    ApiResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(APIResponse) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(dataDto),
              },
            },
          },
        ],
      },
    }),
  )
}

/**
 * A decorator to standardize paginated API responses.
 *
 * @template TDto - The type of the data transfer object (DTO) to be included in the response.
 * @param {TDto} dataDto - The DTO class to be used in the response.
 * @param {ApiResponseOptions} [options] - The options to be passed to the `ApiResponse` decorator.
 * @returns {ApplyDecoratorsReturnType} - The combined decorators to be applied.
 */
export function NBApiResponsePaginated<TDto extends Type<unknown>>(dataDto: TDto, options?: ApiResponseOptions): ApplyDecoratorsReturnType {
  return applyDecorators(
    ApiExtraModels(APIResponse, ListQueryResult, dataDto),
    ApiResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(APIResponse) },
          {
            properties: {
              data: {
                allOf: [
                  {
                    $ref: getSchemaPath(ListQueryResult),
                  },
                  {
                    properties: {
                      items: {
                        type: 'array',
                        items: {
                          $ref: getSchemaPath(dataDto),
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  )
}
