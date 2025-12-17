/**
 * 8 Billion Genies - Project Export
 *
 * Complete project data for the 8 Billion Genies screenplay adaptation.
 * Includes integrated Amazon and Point Grey/Counter Culture feedback notes.
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
