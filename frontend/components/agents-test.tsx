'use client';
import * as React from 'react';
import { getTaskIds, saveTaskInfo } from '@/app/(chat)/agent/actions';
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor';

interface AgentProps {
    user: any;
}

export function Agents({ user }: AgentProps) {
    const [tasksInfo, setTasksInfo] = React.useState([]);
    const [darkTheme, setDarkTheme] = React.useState(false);
    const { scrollRef } = useScrollAnchor();

    // Fetch tasks on mount
    React.useEffect(() => {
        async function fetchTasks() {
            try {
                const data: any = await getTaskIds(user);
                // Enhance data with defaults
                const enhancedData = data.map((org: any) => ({
                    ...org,
                    roles: org.roles?.map((role: any) => ({
                        ...role,
                        tasks: role.tasks?.map((task: any) => ({
                            ...task,
                            assignee: task.assignee || { name: 'Unassigned', avatar: 'U' },
                            priority: task.priority || 'Low',
                            dueDate: task.dueDate || 'No due date',
                            tags: task.tags || [],
                            comments: task.comments || 0,
                            attachments: task.attachments || 0,
                        })),
                    })),
                }));
                setTasksInfo(enhancedData);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        }
        fetchTasks();
    }, [user]);

    // Get avatar gradient for assignee and organization logo
    const getAvatarGradient = (letter: string) => {
        const gradients: { [key: string]: string } = {
            A: 'from-indigo-400 to-purple-500',
            B: 'from-pink-400 to-red-500',
            C: 'from-blue-400 to-cyan-500',
            D: 'from-green-400 to-teal-500',
            U: 'from-gray-500 to-gray-600', // Default for unassigned
            // Add more gradients as needed
        };
        return gradients[letter.toUpperCase()] || 'from-gray-500 to-gray-600';
    };


    // Create task card
    const createTaskCard = (task: any, orgId: string) => (
        <div key={task._id} className="mb-4">
            <button
                onClick={async () => {
                    await saveTaskInfo(user.id, task);
                }}
                className="group flex w-full min-w-[360px] min-h-[120px] items-center gap-5 overflow-hidden rounded-xl bg-background border border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1 relative"
            >
                <div className="before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-indigo-400 before:to-purple-500 before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100"></div>
                <div className="flex flex-col flex-1 text-left">
                    <div className="font-semibold text-base md:text-xl text-gray-800 dark:text-gray-100 line-clamp-2">{task.taskName}</div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 md:line-clamp-3 mt-1">{task.description}</div>
                    
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {task.comments > 0 && (
                            <div className="flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                {task.comments}
                            </div>
                        )}
                        {task.attachments > 0 && (
                            <div className="flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                </svg>
                                {task.attachments}
                            </div>
                        )}
                    </div>
                </div>
            </button>
        </div>
    );

    // Create organization section
    const createOrganizationSection = (org: any) => {
        const allTasks = org.roles?.flatMap((role: any) => role.tasks || []) || [];
        return (
            <div className="organization-section mb-10" data-org-id={org.orgId} key={org.orgId} id={org.orgId}>
                <div className="organization-header flex items-center justify-between mb-6 p-4 bg-background border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                    <div className="organization-info flex items-center gap-3">
                        <div className={`organization-logo h-12 w-12 rounded-xl bg-gradient-to-br ${getAvatarGradient(org.orgName[0])} flex items-center justify-center text-white font-bold text-lg`}>
                            {org.orgName[0]}
                        </div>
                        <div className="organization-details">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{org.orgName}</h2>
                        </div>
                    </div>
                    <div className="org-stats flex items-center gap-4">
                        <div className="stat-item flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium">
                            <span>📋</span>
                            <span>{allTasks.length} Tasks</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allTasks.length > 0 ? (
                        allTasks.map((task: any) => createTaskCard(task, org.orgId))
                    ) : (
                        <div className="empty-state text-center py-10 col-span-full text-gray-500 dark:text-gray-400">
                            <div className="empty-icon text-3xl mb-3">📭</div>
                            <p>No tasks found for this organization</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div
            className="group w-full overflow-auto pl-[50px] peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
            ref={scrollRef}
        >
            <div className={`min-h-screen text-gray-800 dark:text-gray-100 transition-colors duration-300 ${darkTheme ? 'dark' : ''}`} ref={scrollRef}>
                <div className="tasks-header flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-background">
                    <div className="header-left flex items-center gap-4">
                        <h1 className="tasks-title text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Tasks</h1>
                    </div>
                </div>
                <div className="tasks-container px-4 md:px-8 py-8 max-w-7xl mx-auto">
                    {tasksInfo.length === 0 ? (
                        <div className="empty-state text-center py-10 text-gray-500 dark:text-gray-400">
                            <div className="empty-icon text-3xl mb-3">📭</div>
                            <p>No organizations or tasks found</p>
                        </div>
                    ) : (
                        tasksInfo.map((org: any) => createOrganizationSection(org))
                    )}
                </div>
            </div>
        </div>
    );
}