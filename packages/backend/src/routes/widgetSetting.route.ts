import { Router } from 'express'
import { createOrUpdateWidgetSettings, getWidgetSettings } from '../controllers/widgetSetting.controller';

const route: Router = Router()

route.post('/:workspaceId/widget-setting', createOrUpdateWidgetSettings);
route.get('/:workspaceId/widget-setting', getWidgetSettings);

export default route;