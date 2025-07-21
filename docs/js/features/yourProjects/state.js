
import { getUsers, getStatuses } from '../../api/api.js';
import { renderOptionList } from '../../ui/ui.js';
import { translateStatus } from '../../utils/helpers.js';

export const userMap = new Map();
export let selectedUser = null;

export async function cargarOpciones() {

    const users = await getUsers();
    users.forEach(u => userMap.set(u.id.toString(), u));
    renderOptionList("user-select", users, "name", "id");

    const statuses = await getStatuses();
    const translatedStatuses = statuses.map(status => ({ ...status, name: translateStatus(status.name) }));
    renderOptionList("status-select", translatedStatuses, "name", "id");

}

export function setSelectedUser(user) {
    selectedUser = user;
}

