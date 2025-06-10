
import { getProjectDetailsById } from '../api/api.js';
import { openModal, fillModal } from '../ui/modal.js';

export let selectedProjectId = null;

export const verDetalle = async (selectedUser, projectId) => {

    selectedProjectId = projectId;
    const data = await getProjectDetailsById(projectId);
    fillModal(data, selectedUser);
    openModal();
};
