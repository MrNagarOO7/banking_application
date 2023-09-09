import { HttpStatus } from '@nestjs/common';
import resMessage from './respMsgs.json';

function getSuccessResponse(
  data: any = {},
  statusKey: string,
  statusCode: number = HttpStatus.ACCEPTED,
) {
  const msg = resMessage[statusKey]
    ? resMessage[statusKey]
    : resMessage['SUCCESS'];
  return {
    data,
    msg,
    success: true,
    statusCode: statusCode || HttpStatus.ACCEPTED,
  };
}

function getFailedResponse(
  statusKey = 'FAILED',
  statusCode: number = HttpStatus.NOT_ACCEPTABLE,
  error?: string,
) {
  const msg = resMessage[statusKey]
    ? resMessage[statusKey]
    : resMessage['FAILED'];
  return {
    msg,
    success: false,
    statusCode: statusCode || HttpStatus.NOT_ACCEPTABLE,
    error,
  };
}

export const CommonResponse = {
  getSuccessResponse,
  getFailedResponse,
};
