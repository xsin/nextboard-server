import { IListQueryResult } from './common'
import { Resource } from './prisma'

export interface IResource extends Resource {}

export type IResourceList = IListQueryResult<IResource>
