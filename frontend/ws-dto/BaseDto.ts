export class BaseDto<T> {
  eventType: string;

  constructor(init?: Partial<T>) {
    this.eventType = this.constructor.name;
    Object.assign(this, init);
  }
}

export class ServerEchosClientDto extends BaseDto<ServerEchosClientDto> {
  echoValue?: string;
}

export class ServerAddsClientToRoomDto extends BaseDto<ServerAddsClientToRoomDto> {
  roomId?: number;
}

export class ServerSignsClientInDto extends BaseDto<ServerSignsClientInDto> {
  username?: string;
}

export class ServerBroadcastsMessageWithUsernameDto extends BaseDto<ServerBroadcastsMessageWithUsernameDto> {
  username!: string;
  roomId?: number;
  message!: string;
}

export class ClientRequestsAIResponseDto extends BaseDto<ClientRequestsAIResponseDto> {
  messageContent!: string;
}



