const { dialog, BrowserWindow } = require('electron');
const template = [
    {
        label: "파일(F)",
        submenu: [
            {
                label: '열기(O)', click() {
                    console.log("opening files...");
                    const filePath = dialog.showOpenDialogSync({
                        filters: [{name: 'JSON', extensions:['json', 'JSON']}],
                        properties: ['openFile']
                    });
                    if(filePath !== undefined) {
                        console.log(filePath[0].replace(/\\/g, "/"));
                        BrowserWindow.getFocusedWindow().webContents.executeJavaScript(`
                            $.getJSON("` + filePath[0].replace(/\\/g, "/") + `", data => {
                                console.log(data);
                                resultJSON = data;
                                showJSONContent();
                                updateDataContents();
                                updateEditFramesMenu();
                                updateEditFramesContents(Object.keys(resultJSON['frames'])[0]);
                            });
                        `);
                    }
                }
            },
            { type: 'separator' },
            { label: '끝내기(X)', role: 'quit' }
        ]
    },
    {
        label: '편집(E)',
        submenu: [
            { label: '실행 취소', role: 'undo' },
            { label: '다시 실행', role: 'redo' },
            { type: 'separator' },
            { label: '잘라내기', role: 'cut' },
            { label: '복사', role: 'copy' },
            { label: '붙여넣기', role: 'paste' },
            { label: '삭제', role: 'delete' },
            { label: '모두 선택', role: 'selectall' }
        ]
    },
    {
        label: '보기(V)',
        submenu: [
            { label: '앱 다시 실행', role: 'reload' },
            { label: '강제로 다시 실행', role: 'forcereload' },
            { label: '개발자 도구', role: 'toggledevtools' },
            { type: 'separator' },
            { label: '원래 크기로', role: 'resetzoom' },
            { label: '확대', role: 'zoomin' },
            { label: '축소', role: 'zoomout' },
            { type: 'separator' },
            { label: '전체 화면', role: 'togglefullscreen' }
        ]
    },
    {
        label: '창(W)',
        role: 'window',
        submenu: [
            { label: '최소화', role: 'minimize' },
            { label: '닫기', role: 'close' }
        ]
    },
    {
        label: '도움말(H)',
        role: 'help',
        submenu: [
            {
                label: '도움말',
                click() {
                    dialog.showMessageBox({ 
                        message: `1. 데이터 탭에서 스프라이트 정보를 작성하거나, JSON 파일을 열어서 편집하세요.\n\n2. 프레임 편집 탭에서 프레임을 선택하여 각 프레임 별 세부 내용을 편집하세요.\n\n3. JSON 탭에서 결과 데이터를 확인하거나 편집한 뒤 파일로 저장을 눌러 저장하세요.`,
                        buttons: ["확인"]
                    });
                }
            }
        ]
    }
];

module.exports = template;