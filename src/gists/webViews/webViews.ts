import { MainPanelView } from './mainpanel/view';

import { extensionName } from './../config';


export const webViews = {
    mainPanelView: {
        type: `${extensionName}.${MainPanelView.viewType}`,
        view: MainPanelView,
    },
};