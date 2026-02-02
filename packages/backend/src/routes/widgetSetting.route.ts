import { Router } from 'express'
import { createOrUpdateWidgetSettings, getWidgetSettings } from '../controllers/widgetSetting.controller';
import { requireWorkspaceAccess } from '../middlewares/requireWorkspace';

const route: Router = Router()

route.use(requireWorkspaceAccess);

route.post('/:workspaceId/widget-setting', createOrUpdateWidgetSettings);
route.get('/:workspaceId/widget-setting', getWidgetSettings);

export default route;