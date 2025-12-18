/**
 * 8 Billion Genies - Project Export
 *
 * Complete project data for the 8 Billion Genies screenplay adaptation.
 * Includes integrated Amazon and Point Grey/Counter Culture feedback notes.
 */

import { ProjectData, RewriteData } from '../../config/types';
import { config, PAGE_NOTES, OPEN_QUESTIONS, REWRITE_GOALS, REWRITE_SUMMARY } from './config';
import { sequences } from './sequences';

const projectData: ProjectData = {
  config,
  sequences,
};

/**
 * Rewrite tracking data - goals, notes, and questions from development process
 */
export const rewriteData: RewriteData = {
  goals: REWRITE_GOALS,
  pageNotes: PAGE_NOTES,
  openQuestions: OPEN_QUESTIONS,
  summary: REWRITE_SUMMARY,
};

export default projectData;
export { config, sequences, PAGE_NOTES, OPEN_QUESTIONS, REWRITE_GOALS, REWRITE_SUMMARY };
