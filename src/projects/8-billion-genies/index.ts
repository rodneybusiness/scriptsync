/**
 * 8 Billion Genies - Project Export
 *
 * This module exports the complete project data for the 8 Billion Genies screenplay.
 * Adaptation of the Image Comics series by Charles Soule & Ryan Browne.
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
