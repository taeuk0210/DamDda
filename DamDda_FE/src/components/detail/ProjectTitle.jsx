export const ProjectTitle = ({ projectTitle }) => {
    return (
        <div className="container">
            <div style={{ paddingTop: '20px', textAlign: 'center' }}>
                <div className="project-info">
                    <div className="category">{projectTitle.category}</div>
                    <div className="presenter">{projectTitle.nickName}</div>

                    <h1 className="project-title" style={{ fontWeight: 'bold' }}>
                        {projectTitle.title}
                    </h1>
                    <p className="project-description">{projectTitle.description}</p>
                </div>
            </div>
        </div>
    );
};
