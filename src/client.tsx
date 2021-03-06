import 'fetch-everywhere';
import * as bootstrap from 'react-async-bootstrapper';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { History, createBrowserHistory } from 'history';
import { AppContainer as ReactHotLoader } from 'react-hot-loader';
import { AsyncComponentProvider } from 'react-async-component';
import RouterWrapper from './RouterWrapper';
import ProviderUtility from '~utils/ProviderUtility';
import IStore from '~stores/IStore';
import ISagaStore from '~stores/ISagaStore';
import '~css/index.scss';

(async (window: Window) => {

    const codeSplittingState = window.__ASYNC_COMPONENTS_STATE__;
    const serverState: IStore = window.__STATE__;
    const initialState: IStore = {
        ...serverState,
        renderReducer: {
            ...serverState.renderReducer,
            isServerSide: false,
        },
    };

    const history: History = createBrowserHistory();
    const store: ISagaStore<IStore> = ProviderUtility.createProviderStore(initialState, history);
    // const rootEl: HTMLElement = document.getElementById('root');

    delete window.__STATE__;
    delete window.__ASYNC_COMPONENTS_STATE__;

    const composeApp = (Component: any) => (
        <ReactHotLoader key={Math.random()}>
            <AsyncComponentProvider rehydrateState={codeSplittingState}>
                <Component store={store} history={history} />
            </AsyncComponentProvider>
        </ReactHotLoader>
    );

    const renderApp = () => ReactDOM.hydrate(
        composeApp(require('./RouterWrapper').default), document.getElementById('root'),
    )


    bootstrap(composeApp(RouterWrapper)).then(renderApp);

    if (module.hot) {
        module.hot.accept('./RouterWrapper', renderApp);
    }

})(window);
