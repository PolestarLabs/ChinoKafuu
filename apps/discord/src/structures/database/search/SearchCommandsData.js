import ISearchType from './ISearchType';

/**
 * @extends ISearchType<any>
 */
export default class SearchCommandsData extends ISearchType {
  constructor(database) {
    super(database, 'commands')
  }
}