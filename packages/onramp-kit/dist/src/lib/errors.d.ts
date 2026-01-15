export declare function getErrorMessage(error: unknown): string
type GnosisChainSignatureError = {
  info: {
    error: {
      data:
        | string
        | {
            data: string
          }
    }
  }
}
type EthersSignatureError = {
  data: string
}
type SignatureError = Error & EthersSignatureError & GnosisChainSignatureError
/**
 * Parses the isValidSignature call response from different providers.
 * It extracts and decodes the signature value from the Error object.
 *
 * @param {ProviderSignatureError} error - The error object with the signature data.
 * @returns {string} The signature value.
 * @throws It Will throw an error if the signature cannot be parsed.
 */
export declare function parseIsValidSignatureErrorResponse(error: SignatureError): string
export declare function decodeSignatureData(encodedSignatureData: string): string
export {}
