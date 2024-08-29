import IGuildCollection from '../../interfaces/IGuildCollection';
import ISearchType from './ISearchType';

/**
 * @extends ISearchType<IGuildCollection>
 */
export default class SearchGuildsData extends ISearchType {
  constructor(database) {
    super(database, 'guilds')
  }
}