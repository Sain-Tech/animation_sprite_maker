// JSON 데이터 선언
window.resultJSON = {};

// 데이터 탭 입력 값
const inputDatas = {
    imgName: '',
    imgWidth: 0,
    imgHeight: 0,
    imgScale: '1',
    imgFormat: 'RGBA8888',
    imgSpeed: 1000,
    imgFrames: 1,
    appUrl: '',
    appVersion: '0.1'
}

// 프레임 당 너비(px)
let widthPerFrame = inputDatas['imgWidth'] / inputDatas['imgFrames'];

// 탭 목록 및 페이지 구성
const tabConfiguration = () => {
    const tabItems = document.getElementsByClassName('tab-item');
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabItems.length; i++) {
        tabItems[i].addEventListener('click', e => {
            for (let a = 0; a < tabItems.length; a++) {
                if (tabItems[a] === e.target) {
                    tabItems[a].classList.add('active');
                    tabs[a].classList.add('active');
                    if (tabItems[a].innerText === 'JSON') showJSONContent();
                }
                else {
                    tabItems[a].classList.remove('active');
                    tabs[a].classList.remove('active');
                }
            }
        }, false);

        // tabItems[i].addEventListener('mousedown', e => {
        //     console.log('dragstart', e);
        //     e.target.onmousemove = e => {
        //         console.log('dragging', e);
        //         e.target.style.position = 'absolute';
        //         e.target.style.left = e.screenX - 36 + 'px';
        //     }
        // });

        // tabItems[i].addEventListener('mouseup', e => {
        //     console.log('dragleave', e);
        //     e.target.onmousemove = null
        //     e.target.style.position = 'initial';
        // });
    }
}

// 데이터 탭 입력 값 변경 이벤트
const dataInputsChanged = () => {
    const inputs = [imgName, imgWidth, imgHeight, imgScale, imgFormat, imgSpeed, imgFrames, appUrl, appVersion];
    const update = e => {
        const targetName = e.target['name'];
        const targetType = e.target['type'];
        const targetValue = e.target['value'];
        inputDatas[targetName] = targetType === 'number' ? parseInt(targetValue) : targetValue;
        switch (targetName) {
            case 'imgName':
                resultJSON['meta'].image = targetValue + ".png";
                makeFrameSequences();
                updateEditFramesMenu();
                updateEditFramesContents(Object.keys(resultJSON['frames'])[0]);
                break;
            case 'imgWidth':
                resultJSON['meta'].size.w = parseInt(targetValue);
                break;
            case 'imgHeight':
                resultJSON['meta'].size.h = parseInt(targetValue);
                break;
            case 'imgScale':
                resultJSON['meta'].scale = targetValue;
                break;
            case 'imgFormat':
                resultJSON['meta'].format = targetValue;
                break;
            case 'imgSpeed':
                resultJSON['data'].speed = parseInt(targetValue);
                break;
            case 'imgFrames':
                widthPerFrame = inputDatas['imgWidth'] / inputDatas['imgFrames'];
                makeFrameSequences();
                updateEditFramesMenu();
                updateEditFramesContents(Object.keys(resultJSON['frames'])[0]);
                break;
            case 'appUrl':
                resultJSON['meta'].app = targetValue;
                break;
            case 'appVersion':
                resultJSON['meta'].version = targetValue;
                break;
            default:
                break;
        }
    }
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('change', update, false);
    }
}

// JSON 초기화 및 생성 함수
const initJSON = () => {
    // assign properties;
    let frames = {};
    let data = resultJSON['data'];
    let meta = resultJSON['meta'];

    // set data: meta
    meta['app'] = inputDatas['appUrl'];
    meta['version'] = inputDatas['appVersion'];
    meta['image'] = inputDatas['imgName'] + '.png';
    meta['format'] = inputDatas['imgFormat'];
    meta['size'] = { w: inputDatas['imgWidth'], h: inputDatas['imgHeight'] };
    meta['scale'] = inputDatas['imgScale'];

    // set data: data
    data['speed'] = inputDatas['imgSpeed'];

    // set data: frames
    for (let i = 0; i < inputDatas['imgFrames']; i++) {
        frames[`${inputDatas['imgName']}_${i}.png`] = {
            frame: {
                x: i * widthPerFrame,
                y: 0,
                w: widthPerFrame,
                h: inputDatas['imgHeight']
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: widthPerFrame,
                h: inputDatas['imgHeight']
            },
            sourceSize: {
                w: widthPerFrame,
                h: inputDatas['imgHeight']
            }
        }
    }
    resultJSON['frames'] = frames;
}

// 프레임 시퀀스 만드는 함수
const makeFrameSequences = () => {
    // assign properties;
    let frames = {};

    // set data: frames
    for (let i = 0; i < inputDatas['imgFrames']; i++) {
        frames[`${inputDatas['imgName']}_${i}.png`] = {
            frame: {
                x: i * widthPerFrame,
                y: 0,
                w: widthPerFrame,
                h: inputDatas['imgHeight']
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: widthPerFrame,
                h: inputDatas['imgHeight']
            },
            sourceSize: {
                w: widthPerFrame,
                h: inputDatas['imgHeight']
            }
        }
    }
    resultJSON['frames'] = frames;
}

// JSON 변경 비교를 위한 임시 변수
let tempContent;

// JSON Editor에 보여주기
const showJSONContent = () => {
    // JSON 데이터가 변경되면 Editor에 보여주기
    if (JSON.stringify(resultJSON) !== JSON.stringify(tempContent)) {
        tempContent = $.extend({}, resultJSON);
        jsonViewer.load(resultJSON);
    }
}

// 데이터 탭 입력 값 업데이트
const updateDataContents = () => {
    imgName.value = resultJSON['meta'].image.substring(0, resultJSON['meta'].image.length - 4);
    imgWidth.value = resultJSON['meta'].size.w;
    imgHeight.value = resultJSON['meta'].size.h;
    imgScale.value = resultJSON['meta'].scale;
    imgFormat.value = resultJSON['meta'].format;
    imgSpeed.value = resultJSON['data'].speed;
    imgFrames.value = Object.keys(resultJSON['frames']).length;
    appUrl.value = resultJSON['meta'].app;
    appVersion.value = resultJSON['meta'].version;
}

// 프레임 편집 탭 프레임 선택 메뉴 업데이트
const updateEditFramesMenu = () => {
    // update tab edit frames
    const frameKeys = Object.keys(resultJSON['frames']);
    selectFrame.innerHTML = "";
    document.getElementById('total_frames').innerText = frameKeys.length;
    frameKeys.forEach((key, idx) => {
        const option = document.createElement("option");
        option.text = key;
        selectFrame.add(option, idx)
    });
}

// 프레임 편집 탭 입력 값 업데이트
const updateEditFramesContents = frame => {
    const frames = resultJSON['frames'][frame];
    frameX.value = frames['frame'].x;
    frameY.value = frames['frame'].y;
    frameW.value = frames['frame'].w;
    frameH.value = frames['frame'].h;
    sourceSizeW.value = frames['sourceSize'].w;
    sourceSizeH.value = frames['sourceSize'].h;
    spriteSourceSizeX.value = frames['spriteSourceSize'].x;
    spriteSourceSizeY.value = frames['spriteSourceSize'].y;
    spriteSourceSizeW.value = frames['spriteSourceSize'].w;
    spriteSourceSizeH.value = frames['spriteSourceSize'].h;
    selectRotated.value = frames['rotated'];
    selectTrimmed.value = frames['trimmed'];
}

// 프레임 편집 탭 select 이벤트 등록
const editFrames = () => {
    selectFrame.addEventListener('change', e => {
        const value = e.target.value;
        updateEditFramesContents(value);
    }, false);

    selectRotated.addEventListener('change', e => {
        resultJSON['frames'][selectFrame.value]['rotated'] = e.target.value === 'true' ? true : false;
    }, false);

    selectTrimmed.addEventListener('change', e => {
        resultJSON['frames'][selectFrame.value]['trimmed'] = e.target.value === 'true' ? true : false;
    }, false);
}

// 프레임 편집 탭 입력 값 변경 이벤트
const editFrameInputsChanged = () => {
    const inputs = [frameX, frameY, frameW, frameH, sourceSizeW, sourceSizeH, spriteSourceSizeX, spriteSourceSizeY, spriteSourceSizeW, spriteSourceSizeH];
    const update = e => {
        const selectedFrame = selectFrame.value;
        const frame = resultJSON['frames'][selectedFrame];
        const targetName = e.target['name'];
        const targetType = e.target['type'];
        const targetValue = parseInt(e.target['value']);
        switch (targetName) {
            case 'frameX':
                frame['frame'].x = targetValue;
                break;
            case 'frameY':
                frame['frame'].y = targetValue;
                break;
            case 'frameW':
                frame['frame'].w = targetValue;
                break;
            case 'frameH':
                frame['frame'].h = targetValue;
                break;
            case 'sourceSizeW':
                frame['sourceSize'].w = targetValue;
                break;
            case 'sourceSizeH':
                frame['sourceSize'].h = targetValue;
                break;
            case 'spriteSourceSizeX':
                frame['spriteSourceSize'].x = targetValue;
                break;
            case 'spriteSourceSizeY':
                frame['spriteSourceSize'].y = targetValue;
                break;
            case 'spriteSourceSizeW':
                frame['spriteSourceSize'].w = targetValue;
                break;
            case 'spriteSourceSizeH':
                frame['spriteSourceSize'].h = targetValue;
                break;
            default:
                break;
        }
    };
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keyup', update, false);
        inputs[i].addEventListener('change', update, false);
    }
}

// JSON 파일 드래그 앤 드롭
const fileDragAndDrop = () => {
    const dragOver = e => {
        e.stopPropagation();
        e.preventDefault();
        if (e.type === 'dragover') document.querySelector('.overlay.upload').classList.add('show');
        else document.querySelector('.overlay.upload').classList.remove('show');
    }
    const uploadFiles = e => {
        e.preventDefault(); // 이 부분이 없으면 파일을 브라우저 실행해버립니다.
        dragOver(e);
        const data = e.dataTransfer;
        if (data.items) { // DataTransferItemList 객체 사용
            if (data.items.length > 1) {
                alert("파일은 하나만 올려주세요.");
                return;
            }
            if (data.items[0].kind == 'file') { // 아이템 종류가 파일이면
                const file = data.items[0].getAsFile(); // File API 사용
                if(file.type === 'application/json') {
                    $.getJSON(file.name, data => {
                        console.log(data);
                        resultJSON = data;
                        showJSONContent();
                        updateDataContents();
                        updateEditFramesMenu();
                        updateEditFramesContents(Object.keys(resultJSON['frames'])[0]);
                    });
                }
                else {
                    alert("지원하는 형식이 아닙니다.");
                    return;
                }
            }
        } else { // File API 사용
            if (data.files.length > 1) {
                alert("파일은 하나만 올려주세요.");
                return;
            }
            if(data.file[0].type === 'application/json') {
                $.getJSON(data.file[0].name, data => {
                    console.log(data);
                    resultJSON = data;
                    showJSONContent();
                    updateDataContents();
                    updateEditFramesMenu();
                    updateEditFramesContents(Object.keys(resultJSON['frames'])[0]);
                });
            }
            else {
                alert("지원하는 형식이 아닙니다.");
                return;
            }
        }
        
    }
    document.body.addEventListener('dragover', dragOver, false);
    document.body.addEventListener('dragleave', dragOver, false);
    document.body.addEventListener('drop', uploadFiles, false);
}

// 문서가 로드되었을 때 변수 및 함수 초기화 및 선언
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        /** 각 탭 입력 값 */
        window.imgName = document.getElementsByName('imgName')[0];
        window.imgWidth = document.getElementsByName('imgWidth')[0];
        window.imgHeight = document.getElementsByName('imgHeight')[0];
        window.imgScale = document.getElementsByName('imgScale')[0];
        window.imgFormat = document.getElementsByName('imgFormat')[0];
        window.imgSpeed = document.getElementsByName('imgSpeed')[0];
        window.imgFrames = document.getElementsByName('imgFrames')[0];
        window.appUrl = document.getElementsByName('appUrl')[0];
        window.appVersion = document.getElementsByName('appVersion')[0];
        window.frameX = document.getElementsByName('frameX')[0];
        window.frameY = document.getElementsByName('frameY')[0];
        window.frameW = document.getElementsByName('frameW')[0];
        window.frameH = document.getElementsByName('frameH')[0];
        window.sourceSizeW = document.getElementsByName('sourceSizeW')[0];
        window.sourceSizeH = document.getElementsByName('sourceSizeH')[0];
        window.spriteSourceSizeX = document.getElementsByName('spriteSourceSizeX')[0];
        window.spriteSourceSizeY = document.getElementsByName('spriteSourceSizeY')[0];
        window.spriteSourceSizeW = document.getElementsByName('spriteSourceSizeW')[0];
        window.spriteSourceSizeH = document.getElementsByName('spriteSourceSizeH')[0];
        window.selectFrame = document.getElementsByName('selectFrame')[0];
        window.selectRotated = document.getElementsByName('rotated')[0];
        window.selectTrimmed = document.getElementsByName('trimmed')[0];

        /** JSON 기본 구조 생성 */
        resultJSON['frames'] = {};
        resultJSON['data'] = {};
        resultJSON['meta'] = {};

        /** JSON Editor 등록 */
        window.jsonViewer = new JsonEditor('.json-viewer');

        /** JSON Editor 컨텐츠 변경 이벤트 */
        jsonViewer.$container[0].addEventListener('DOMSubtreeModified', e => {
            /** 일정 딜레이 이후 변경 사항 반영 */
            setTimeout(() => {
                /** JSON 데이터 업데이트 */
                resultJSON = jsonViewer.get();
                updateDataContents();
                updateEditFramesMenu();
                updateEditFramesContents(Object.keys(resultJSON['frames'])[0]);
            }, 100);
        }, true);
        tabConfiguration();
        dataInputsChanged();
        initJSON();
        editFrames();
        editFrameInputsChanged();
        updateEditFramesMenu();
        updateEditFramesContents(Object.keys(resultJSON['frames'])[0]);
        showJSONContent();
        fileDragAndDrop();

        const saveBtn = document.getElementById('saveToFile');
        saveBtn.addEventListener('click', e => {
            // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
            console.log("Saving to file...");
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resultJSON));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', dataStr);
            downloadAnchorNode.setAttribute('download', imgName.value + '.json');
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }, false);
    }
}