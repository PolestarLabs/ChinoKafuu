import IUserCollection from '../../interfaces/IUserCollection';
import ISearchType from './ISearchType';

/**
 * @extends ISearchType<IUserCollection>
 */
export default class SearchUsersData extends ISearchType {
  constructor(database) {
    super(database, 'users')
  }
}