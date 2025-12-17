/**
 * Bell Bottoms - Project Export
 *
 * This module exports the complete project data for the Bell Bottoms screenplay.
 * Used as the sample project demonstrating ScriptSync capabilities.
 */

import { ProjectData } from '../../config/types';
import { config } from './config';
import { sequences } from './sequences';

const projectData: ProjectData = {
  config,
  sequences,
};

export default projectData;
export { config, sequences };
