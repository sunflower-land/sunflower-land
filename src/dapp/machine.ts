import { createMachine, Interpreter, EventObject, interpret, assign } from 'xstate';
import { Charity } from './types/contract'
import { BlockChain } from './Blockchain';

export interface Context {
    blockChain: BlockChain
    errorCode?: 'NO_WEB3' | 'WRONG_CHAIN'
}

const hasFarm = (
    { blockChain }: Context,
) => {
    return blockChain.isTrial ||  blockChain.hasFarm
};

const MOBILE_DEVICES = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

const isMobile = () => {
    return MOBILE_DEVICES.test(navigator.userAgent)
};

export interface FarmCreatedEvent extends EventObject {
    type: 'FARM_CREATED';
}

export interface NetworkChangedEvent extends EventObject {
    type: 'NETWORK_CHANGED';
}

export interface GetStartedEvent extends EventObject {
    type: 'GET_STARTED';
}

export interface SaveEvent extends EventObject {
    type: 'SAVE';
}

export interface TrialEvent extends EventObject {
    type: 'TRIAL';
}


export interface DonateEvent extends EventObject {
    type: 'DONATE';
    charity: Charity
}

export interface UpgradeEvent extends EventObject {
    type: 'UPGRADE';
}

export interface FinishEvent extends EventObject {
    type: 'FINISH';
}

export interface CloseOnboardingEvent extends EventObject {
    type: 'CLOSE';
}

export interface NextOnboardingEvent extends EventObject {
    type: 'NEXT';
}

export interface HarvestedOnboardingEvent extends EventObject {
    type: 'HARVEST';
}

export interface PlantedOnboardingEvent extends EventObject {
    type: 'PLANT';
}


type OnboardingEvent = CloseOnboardingEvent | NextOnboardingEvent | HarvestedOnboardingEvent | PlantedOnboardingEvent

export type BlockchainEvent =
    | FarmCreatedEvent
    | NetworkChangedEvent
    | GetStartedEvent
    | SaveEvent
    | UpgradeEvent
    | DonateEvent
    | TrialEvent
    | FinishEvent
    | CloseOnboardingEvent
    | OnboardingEvent


export type OnboardingStates = 'harvesting' | 'token' | 'planting' | 'saving' | 'market'

export type BlockchainState = {
    value:
        'loading'
        | 'initial'
        | 'registering'
        | 'creating'
        | 'onboarding'
        | 'farming'
        | 'failure'
        | 'upgrading'
        | 'saving'
        | 'unsupported'
        | OnboardingStates
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
    initial: 'initial',
    context: {
        blockChain: new BlockChain(),
        errorCode: null,
    },
    states: {
        initial: {
            on: {
                GET_STARTED: [{
                    target: 'unsupported',
                    cond: isMobile,
                }, {
                    target: 'loading',
                }]
            }
        },
        loading: {
            invoke: {
                src: ({ blockChain }) => blockChain.initialise(),
                onDone: [
                    {
                        target: 'farming',
                        cond: hasFarm,
                    },
                    {
                        target: 'registering'
                    }
                ],
                onError: {
                    target: 'failure',
                    actions:  assign({
                        errorCode: (context, event) => event.data.message,
                    }),
                },
            },
        },
        registering: {
            on: {
                DONATE: {
                    target: 'creating',
                },
            }
        },
        creating: {
            invoke: {
                src: ({ blockChain }, event) => blockChain.createFarm((event as DonateEvent).charity),
                onDone: {
                    target: 'onboarding',
                },
                onError: {
                    target: 'failure',
                    actions:  assign({
                        errorCode: (context, event) => event.data.message,
                    }),
                },
            },
        },
        onboarding: {
            on: {
                FINISH: {
                    target: 'farming'
                },
                CLOSE: {
                    target: 'farming',
                }
            },
            initial: 'harvesting',
            states: {
              harvesting: {
                on: {
                    HARVEST: { target: 'token' }
                }
              },
              token: {
                on: {
                    NEXT: { target: 'planting' }
                }
              },
              planting: {
                on: {
                    PLANT: { target: 'saving' }
                }
              },
              saving: {
                  on: {
                    NEXT: { target: 'market' }
                  }
              },
              market: {},
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
                src: async ({ blockChain }, event) => blockChain.save(),
                onDone: {
                    target: 'farming',
                    // actions - assign() data?
                },
                onError: {
                    target: 'failure',
                    actions:  assign({
                        errorCode: (context, event) => event.data.message,
                    }),
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
                    actions:  assign({
                        errorCode: (context, event) => event.data.message,
                    }),
                }
            }
        },
        failure: {
            on: {
                NETWORK_CHANGED: {
                    target: 'loading',
                    actions: (context) => { context.blockChain.endTrialMode() }
                },
                TRIAL: {
                    target: 'onboarding',
                    actions: (context) => { context.blockChain.startTrialMode() }
                }
            }
        },
        unsupported: {},
    }
  });

export const service = interpret<Context,
    any,
    BlockchainEvent,
    BlockchainState
>(blockChainMachine)

service.start()
