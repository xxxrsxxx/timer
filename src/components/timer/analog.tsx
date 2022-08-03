import React, { useCallback, useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

import { getToolTip, useHookMain } from "../../store/commerce/main";

type TimeType = { hour: number; min: number; sec: number };

type TimePointType = {
  hr: number;
  mr: number;
  sr: number;
};

type ItemsType = {
  id: number;
  type: string;
  timePoint: number;
  h: number;
  dr: number;
};

type ClockNumType = { id: number; x: number; y: number };

/**
 * @name getTime
 * @description get 시간 정보
 */
function getTime() {
  const now: any = new Date();
  const time: TimeType = {
    hour: now.getHours() % 12,
    min: now.getMinutes(),
    sec: now.getSeconds(),
  };
  const timePoint: TimePointType = {
    hr: 30 * time.hour + 0.5 * time.min,
    mr: 6 * time.min + 0.1 * time.sec,
    sr: 6 * time.sec,
  };
  return { time, timePoint };
}

function Analog() {
  let tm: any = useRef(null);
  const [clockNumArray, setClockNumArray] = useState<ClockNumType[]>([]);
  const { mainState, dispatch } = useHookMain();
  const [needles, setNeedles] = useState<ItemsType[]>([]);

  useEffect(() => {
    /**
     * @description 시간 배치
     */
    let result: any[] = [],
      rad,
      x,
      y,
      exp = (30 / 180) * Math.PI;
    for (let i = 1; i < 13; i++) {
      rad = exp * (i - 3);
      x = Math.cos(rad) * 140;
      y = Math.sin(rad) * 140 - 5;
      result = [...result, { id: i, x, y }];
    }
    const { timePoint } = getTime();
    let _needles: ItemsType[] = [];
    _needles = _needles.concat([
      { id: 0, type: "hour", timePoint: timePoint.hr, h: 110, dr: 43200 },
      { id: 1, type: "min", timePoint: timePoint.mr, h: 138, dr: 3600 },
      { id: 2, type: "sec", timePoint: timePoint.sr, h: 150, dr: 60 },
    ]);
    setNeedles((state: ItemsType[]) => [...state, ..._needles]);
    setClockNumArray(result);
  }, []);

  /**
   * @name items
   * @description 시계 바늘 정보
   */
  // const items = useMemo(() => {
  //   const config: ItemsType[] = [
  //     { id: 0, type: "hour", timePoint: timePoint.hr, h: 110, dr: 43200 },
  //     { id: 1, type: "min", timePoint: timePoint.mr, h: 138, dr: 3600 },
  //     { id: 2, type: "sec", timePoint: timePoint.sr, h: 150, dr: 60 },
  //   ];
  //   return config;
  // }, []);

  /**
   * @name toolTipHandler
   * @description toolTip handler 상태 관리 로직
   */
  const toolTipHandler = useCallback(
    (confirm: boolean) => {
      if (confirm) {
        tm.current = setInterval(() => {
          const { time } = getTime();
          const value = `${time.hour}시 ${time.min}분 ${time.sec}초`;
          //setTool({ active: true, value });
          dispatch(getToolTip({ active: true, value }));
        }, 500);
      }
      if (!confirm) {
        clearInterval(tm.current);
        dispatch(getToolTip({ active: false, value: "" }));
      }
    },
    [dispatch]
  );

  // @ts-ignore
  return (
    <>
      <Clock
        onMouseEnter={() => {
          toolTipHandler(true);
        }}
        onMouseLeave={() => {
          toolTipHandler(false);
        }}
      >
        <ClockNum>
          {clockNumArray.map((e) => (
            <ClockNumItems key={`sItems_${e.id}`} x={e.x} y={e.y}>
              {e.id}
            </ClockNumItems>
          ))}
        </ClockNum>
        <NeedlesWrap>
          {needles.length &&
            needles.map((e) => (
              <NeedlesItems key={`items_${e.id}`} dr={e.dr}>
                <Needles pt={e.timePoint} h={e.h} />
              </NeedlesItems>
            ))}
        </NeedlesWrap>
      </Clock>
      {mainState.active && <div>{mainState.value}</div>}
    </>
  );
}

const Clock = styled.div`
  margin: 20px;
  width: 300px;
  height: 300px;
  border-radius: 100%;
  border: 2px solid #333;
  position: relative;
`;

const ClockNum = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;
const ClockNumItems = styled.div<any>`
  position: absolute;
  width: 10px;
  height: 10px;
  left: ${(props) => `${props.x}px`};
  top: ${(props) => `${props.y}px`};
`;
const NeedlesWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  &:after {
    content: "";
    display: block;
    width: 4px;
    height: 4px;
    position: absolute;
    top: -2px;
    left: -2px;
    background-color: red;
    border-radius: 100%;
  }
`;
const rotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const NeedlesItems = styled.div<any>`
  animation-name: ${rotation};
  animation-duration: ${(props) => `${props.dr}s`};
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;

const Needles = styled.span<any>`
  &:before {
    content: "";
    width: 4px;
    height: ${(props) => `${props.h}px`};
    background-color: #333;
    position: absolute;
    left: -2px;
    bottom: -4px;
  }
  display: block;
  position: absolute;
  transform: rotate(${(props) => `${props.pt}deg`});
`;

export default Analog;
