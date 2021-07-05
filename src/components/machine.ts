import { createMachine, Interpreter, EventObject, interpret, assign } from 'xstate';
import { Transaction, Charity } from './types/contract'
import { BlockChain } from './Blockchain';

export interface Context {
    blockChain: BlockChain
}

const isConnected = (
    { blockChain }: Context,
) => {
    return blockChain.isConnected;
};

const hasFarm = (
    { blockChain }: Context,
) => {
    return blockChain.hasFarm
};

export interface FarmCreatedEvent extends EventObject {
    type: 'FARM_CREATED';
}

export interface ConnectedEvent extends EventObject {
    type: 'CONNECTED';
}

export interface GetStartedEvent extends EventObject {
    type: 'GET_STARTED';
}

export interface SaveEvent extends EventObject {
    type: 'SAVE';
    events: Transaction[]
}


export interface DonateEvent extends EventObject {
    type: 'DONATE';
    charity: Charity
}

export interface UpgradeEvent extends EventObject {
    type: 'UPGRADE';
}

export type BlockchainEvent =
    | FarmCreatedEvent
    | ConnectedEvent
    | GetStartedEvent
    | SaveEvent
    | UpgradeEvent
    | DonateEvent


export type BlockchainState = {
    value:
        'loading'
        | 'initial'
        | 'registering'
        | 'creating'
        | 'farming'
        | 'notConnected'
        | 'failure'
        | 'upgrading'
        | 'saving'
    context: Context;
};

export type BlockchainInterpreter = Interpreter<
        Context,
        any,
        BlockchainEvent,
        BlockchainState
    >
export const blockChainMachine = createMachine<
    Context,
    BlockchainEvent,
    BlockchainState
>({
    id: 'farmMachine',
    initial: 'loading',
    context: {
        blockChain: new BlockChain()
    },
    states: {
        loading: {
            invoke: {
                src: ({ blockChain }) => blockChain.initialise(),
                onDone: [
                    {
                        target: 'farming',
                        cond: hasFarm,
                    },
                    {
                        target: 'initial'
                    }
                ],
                onError: {
                    target: 'failure',
                },
            },
        },
        initial: {
            on: {
                GET_STARTED: [
                    {
                      target: 'registering',
                      cond: isConnected
                    },
                    {
                        target: 'notConnected'
                    }
                ]
            }
        },
        registering: {
            on: {
                DONATE: {
                    target: 'creating',
                }
            }
        },
        creating: {
            invoke: {
                src: ({ blockChain }, event) => blockChain.createFarm((event as DonateEvent).charity),
                onDone: {
                    target: 'farming',
                },
                onError: {
                    target: 'failure',
                },
            },
        },
        notConnected: {
            on: {
                CONNECTED: [
                    {
                        target: 'farming',
                        cond: hasFarm
                    },
                    {
                      target: 'registering',
                    },
                ]
            }
        },
        farming: {
            on: {
                SAVE: {
                    target: 'saving',
                },
                UPGRADE: {
                    target: 'upgrading'
                }
            }
        },
        saving: {
            invoke: {
                id: 'save',
                src: async ({ blockChain }, event) => blockChain.save((event as SaveEvent).events),
                onDone: {
                    target: 'farming',
                    // actions - assign() data?
                },
                onError: {
                    target: 'failure',
                }
            }
        },
        upgrading: {
            invoke: {
                id: 'upgrading',
                src: async ({ blockChain }) => {
                    await blockChain.levelUp()
                },
                onDone: {
                    target: 'farming',
                },
                onError: {
                    target: 'failure',
                }
            }
        },
        failure: {}
    }
  });

export const service = interpret<Context,
    any,
    BlockchainEvent,
    BlockchainState
>(blockChainMachine)

service.start()
