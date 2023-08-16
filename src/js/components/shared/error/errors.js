import Message from '../../shared/message';

const DEFAULT_ERROR_MESSAGE = 'Ops, an error occurred';

export default class Errors {
  static handle(error) {
    Message.error(DEFAULT_ERROR_MESSAGE);
  }
}
