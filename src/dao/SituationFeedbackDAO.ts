import {BaseDAO} from './BaseDAO';

import {IHasHTTP} from '../api/IHasHTTP';
import {IHash} from '../internal/IHash';
import {IOnmsHTTP} from '../api/IOnmsHTTP';
import {OnmsError} from '../api/OnmsError';
import {OnmsHTTPOptions} from '../api/OnmsHTTPOptions';

import {OnmsSituationFeedback} from '../model/OnmsSituationFeedback';
import {FeedbackTypes, OnmsSituationFeedbackType} from '../model/OnmsSituationFeedbackType';

import {OnmsParm} from '../model/OnmsParm';
import {OnmsServiceType} from '../model/OnmsServiceType';

import {log, catDao} from '../api/Log';
import {Category} from 'typescript-logging';

/**
 * Data access for [[OnmsSituationFeedback]] objects.
 * @module SituationFeedbackDAO
 */
export class SituationFeedbackDAO extends BaseDAO {

  constructor(impl: IHasHTTP | IOnmsHTTP) {
    super(impl);
  }

  /**
   * Retrieve feedback.
   *
   * @version ReST v1
   * @param {number} situationId - The alarmId of the Situation to use when querying.
   * @return An array of [[OnmsSituationFeedback]] objects.
   */
  public async getFeedback(situationId: number): Promise<OnmsSituationFeedback[]> {
    const options = new OnmsHTTPOptions();
    options.headers.accept = 'application/json';
    return this.http.get(this.pathToEndpoint() + '/' + situationId, options).then((result) => {
      const data = this.getData(result);
      if (!Array.isArray(data)) {
        if (!data) {
          return [] as OnmsSituationFeedback[];
        }
        throw new OnmsError('Expected an array of feedback but got "' + (typeof data) + '" instead.');
      }
      return data.map((feedbackData) => {
        return this.fromData(feedbackData);
      });
    });
  }

  /**
   * Submit Correlation Feedback for a Situation.
   *
   * @version ReST v1
   * @param {number} situationId - The alarmId of the Situation to use when querying.
   * @param {OnmsSituationFeedback[]} feedback - The [[OnmsSituationFeedback]].
   */
  public async saveFeedback(feedback: OnmsSituationFeedback[], situationId: number): Promise<void> {
    return this.post(this.pathToEndpoint() + '/' + situationId, this.serializeFeedback(feedback));
  }

    /**
     * Extracts the data from an HTTP Request result.
     *
     * @param result the HTTP Request result.
     * @returns An array of [[OnmsSituationFeedback]] objects.
     */
  public getData(result: any): OnmsSituationFeedback[] {
    const data = result.data;
    if (!Array.isArray(data)) {
      throw new OnmsError('Expected an array of situationFeedback but got "' + (typeof data) + '" instead.');
    }
    return data;
  }

  /**
   * Generate a feedback object from the given dictionary.
   * @hidden
   */
  public fromData(data: any) {
    const feedback = new OnmsSituationFeedback();
    feedback.situationKey = data.situationKey;
    feedback.fingerprint = data.situationFingerprint;
    feedback.alarmKey = data.alarmKey;
    feedback.reason = data.reason;
    feedback.user = data.user;
    if (data.feedbackType) {
      const fbt = data.feedbackType;
      feedback.feedbackType = OnmsSituationFeedbackType.forId(fbt);
    }
    feedback.timestamp = this.toNumber(data.timestamp);
    return feedback;
  }

  /**
   * Serialize the feedbackType as a string.
   * @hidden
   */
  public serializeFeedback(feedback: OnmsSituationFeedback[]): any[] {
    const serializeFeedback = [];
    feedback.forEach((fb) => {
        // Create a shallow clone
        const sfb = Object.assign({}, fb) as any;
        // Set the type to the id, to avoid serializing it as an object
        if (sfb.feedbackType !== null) {
            sfb.feedbackType = sfb.feedbackType.id;
        }
        serializeFeedback.push(sfb);
    });
    return serializeFeedback;
  }

  /**
   * Call a POST request in the format the SituationFeedback API expects.
   * @hidden
   */
  private async post(url: string, data: any): Promise<void> {
    const options = new OnmsHTTPOptions();
    options.headers['content-type'] = 'application/json';
    options.headers.accept = 'application/json';
    options.data = data;
    return this.http.post(url, options).then((result) => {
      if (!result.isSuccess) {
        throw result;
      }
      return;
    });
  }

  /**
   * Get the path to the SituationFeedback endpoint.
   * @hidden
   */
  private pathToEndpoint() {
    return 'rest/situation-feedback';
  }

}
