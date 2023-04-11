import { Shed } from "@api/models/herpetofauna/shed";
import { _shed } from "@api/models/herpetofauna/_mockData/shed";
import { getFindOneMock } from "@test/helpers/QueryMock";
import { Request, Response } from 'express';
import { createRequest, createResponse, MockRequest, MockResponse } from 'node-mocks-http';
import { getSingleShed } from "../sheds";

const mockingoose = require("mockingoose");

describe('Shed CRUD Controller', () => {
    let mockResponse: MockResponse<Response>;

    beforeEach(() => {
        mockResponse = createResponse();
    });

    it('getSingleShed: should return the doc with findById', async () => {
        const finderMock = getFindOneMock(_shed, '507f191e810c19729de860ea');
        const mockRequest: MockRequest<Request<{ shedId: string }>> = createRequest({ params: { shedId: '507f191e810c19729de860ea' } })

        mockingoose(Shed).toReturn(finderMock, 'findOne');
        await getSingleShed(mockRequest, mockResponse);

        expect(mockResponse._getJSONData()).toMatchObject(_shed);
    });

    it('getSingleShed: should return error status and and message', async () => {
        const finderMock = getFindOneMock(_shed, '507f191e810c19729de860ea');
        const mockRequest: MockRequest<Request<{ shedId: string }>> = createRequest({ params: { shedId: '507f191e810c19729de860ea' } })

        mockingoose(Shed).toReturn(new Error('Test Error'), 'findOne');
        await getSingleShed(mockRequest, mockResponse);

        expect(mockResponse.statusCode).toBe(422);
    });
});