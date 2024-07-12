const MutationRecordType = {
  attributes: 'attributes',
  childList: 'childList',
};

/**
 * @param {MutationRecord} mutation
 * @returns {boolean}
 */
export function isMutationRecordAttributes({ type }) {
  return type === MutationRecordType.attributes;
}

/**
 * @param {MutationRecord} mutation
 * @returns {boolean}
 */
export function isMutationRecordChidList({ type }) {
  return type === MutationRecordType.childList;
}
