import Joyride, { ACTIONS } from 'react-joyride';

function TourComponent({ children }) {
    const steps = [
        {
            target: '.dashboard--topbar__avatar',
            content: 'update your profile details and logout',
            disableBeacon: true
        },
        {
            target: '.dashboard--filterbar',
            content: 'search for tasks and filter by date or text in ascending or descending order',
            disableBeacon: true
        },
        {
            target: '.dashboard--tasklist__task',
            content: 'long-press or right-click a task to edit or delete that task',
            disableBeacon: true
        },
        {
            target: '.dashboard--tasklist__task--complete-icon',
            content: 'mark task as complete',
            disableBeacon: true
        },
        {
            target: '.dashboard--add-button',
            content: 'create a new task',
            disableBeacon: true
        },
    ];

    function handleJoyrideCallback( data ) {
        const { action } = data;

        if ( 
            action == ACTIONS.CLOSE ||
            action == ACTIONS.SKIP ||
            action == ACTIONS.STOP ||
            action == ACTIONS.RESET
        ) {
            localStorage.setItem('taskify-has-seen-tour', true)
        }
    }

  return (
    <>
        { children }
        <Joyride 
            steps={steps} 
            continuous={true}
            run={!localStorage.getItem('taskify-has-seen-tour')}
            showProgress={true}
            showSkipButton={true}
            spotlightClicks={false}
            disableScrollParentFix={true}
            disableScrolling={true}
            styles={{
                options: {
                    overlayColor: 'rgba(0, 0, 0, 0.856)',
                },
                tooltipContent: {
                    textTransform: 'capitalize'
                },
                buttonNext: {
                    backgroundColor: "oklch(76.9% 0.188 70.08)"
                },
                buttonBack: {
                    color: "black"
                },
                buttonSkip: {
                    color: "black"
                }
            }}
            locale={{
                last: 'Finish',
                nextLabelWithProgress: 'Next ({step} of {steps})',
            }}
            callback={ handleJoyrideCallback }
        />
    </>
  )
}

export default TourComponent
