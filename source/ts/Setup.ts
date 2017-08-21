/*
 *     GAME CONFIGURATION
 * */

class Setup {

    public static paytable: any = {
        values: {
            match1: {spots3: 8, spots4: 42, spots5: 86},
            match2: {spots2: 6, spots6: 6, spots8: 4},
            match3: {spots3: 32, spots4: 2, spots7: 1},
            match4: {spots4: 74, spots5: 3, spots6: 2, spots7: 1, spots8: 1, spots9: 1},
            match5: {spots5: 388, spots6: 28, spots7: 14, spots8: 3, spots9: 2, spots10: 3},
            match6: {spots6: 632, spots7: 156, spots8: 40, spots9: 20, spots10: 10},
            match7: {spots7: 2400, spots8: 660, spots9: 118, spots10: 62},
            match8: {spots8: 6000, spots9: 1600, spots10: 345},
            match9: {spots9: 6300, spots10: 1500},
            match10: {spots10: 8000}
        },
        max: 6
    };

    public static credits: any = {
        init: 1000
    };

    public static spots: any = {
        min: 2,
        max: 10
    };

    public static balls: any = {
        total: 80,
        colors: ["red", "green", "blue", "pink", "yellow", "neutral"],
        neutral: 5
    };

    public static sample: number = 1;

    public static options: any = {
        select: [
            {
                name: "quickpick",
                default: 0,
                items: ["Remember last selection or", "Select always this number of spots:"]
            },
            {
                name: "quickpickFavorite",
                default: Setup.spots.max - Setup.spots.min,
                range: {start: Setup.spots.min, end: (Setup.spots.max + 1)}
            },
            {
                name: "autoplay",
                default: 0,
                items: ["Stop manually or", "Stop after specific number of plays or", "Stop when credits bellow or above specific range"]
            },
            {
                name: "maxbet",
                default: 1,
                items: [2, 4, 5, 6, 8, 10]
            },
            {
                name: "audio",
                default: 1,
                items: ["Off", "low", "High"],
                vals: [0, .5, 1]
            },
            {
                name: "speed",
                default: 1,
                items: ["Slow", "Fast", "Ultra"]
            },
        ],
        input: {
            values: [100, 0, Setup.credits.init * 2],
            text: "Plays / Min Credit / Max Credit"
        }
    };

    public static messages: any = {
        start: [
            "CHANGE BET OR TOUCH START TO BEGIN",
            "CANCEL MAXBET BY PRESSING BET ONE",
            "SELECT BETWEEN " + Setup.spots.min + " AND " + Setup.spots.max + " BALLS",
            "QUICKPICK SELECTS RANDOM BALLS",
            "CLEARALL CLEARS SELECTED BALLS"
        ],
        progress: "GAME IN PROGRESS",
        success: "YOU HAVE WON "
    };

    public static help: string[] = [
        "To play <label>COLORME KENO</label> select between 2 and 10 balls from the group of 80 balls located on the board. Once the game begins, each ball will be given a color from a set of 5 different colors. These 5 colors will be evenly distributed among the 80 balls. That is, each color will be present in 16 balls after all the balls have been \"colored\". The goal is to gather as many colors as possible in the set of selected balls. Wins are based on the number of balls selected, the largest number of balls of the same color achieved and the number of credits bet.",
        "Press this button to start the game at<br/>the current bet",
        "Press this button to automatically select random balls",
        "Press this button to play several games<br/>at the current bet",
        "Press this button to clear any balls selected",
        "Press these buttons to increase the bet by one or to bet the maximum amount of credits allowed respectively",
        "Visit the options panel to adjust the game according your preferences. The available options for customization are Quickpick, Autoplay, Maxbet, Audio and Speed. Likewise, the Payouts panel shows the winnings for each selection that can be made according the number of matches achieved."
    ];

    public static link: any = {
        text: "DO YOU LIKE THIS GAME? CLIC HERE TO CONTACT ME",
        href: "https://www.facebook.com/allcrossword/",
        target: "_blank"
    };

    public static sounds: any = {
        root: "files/assets/media/",
        ext: ".wav",
        types: ["ball", "button", "play", "collect"]
    };

    public static html: any = {
        activeClass: "active",
        hidingClass: "hide"
    };

}