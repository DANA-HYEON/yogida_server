import commonError from '../constants/errorConstant.js';
import CustomError from '../middleware/errorHandler.js';

// 여기다에서 제공되는 태그 목록
const tagList = [
  '체험·엠티비티',
  'SNS 핫플레이스',
  '자연적인',
  '유명 관광지',
  '힐링',
  '문화·예술·역사',
  '맛집 탐방',
  '혼자',
  '친구와',
  '연인과',
  '아이와',
  '부모님과',
  '반려견과',
  '기타',
];

// 여기다에서 제공되는 여행 목록
export const cityList = [
  '국내',
  '가평·양평',
  '강릉·속초',
  '서울',
  '경주',
  '부산',
  '여수',
  '인천',
  '전주',
  '제주',
  '춘천·홍천',
  '태안',
  '통영·거제·남해',
  '포항·안동',
];

// 사용자 권한 확인
export async function checkUserId(post, userId) {
  if (post.authorId.equals(userId)) {
    throw new CustomError(commonError.USER_MATCH_ERROR, '게시글을 수정할 권한이 없습니다.', {
      statusCode: 403,
    });
  }
}

// post 유무 확인
export async function checkPost(post) {
  if (!post) {
    throw new CustomError(commonError.POST_NOT_FOUND, '게시글을 찾을 수 없습니다.', {
      statusCode: 404,
    });
  }
}

// 시용자가 검색한 여행지가 기존에 제공된 여행지인지 검사
export async function checkCityListIncludedCity(city) {
  if (!cityList.includes(city)) {
    throw new CustomError(commonError.SEARCHED_CITY_UNKNOWN_ERROR, '검색어를 찾을 수 없습니다.', {
      statusCode: 404,
    });
  }
}

// 시용자가 선택한 태그들이 기존에 제공된 태그인지 검사
export async function checkTagListIncludedTag(tags) {
  for (const tag of tags) {
    if (!tagList.includes(tag)) {
      throw new CustomError(commonError.TAG_UNKNOWN_ERROR, '태그를 찾을 수 없습니다.', {
        statusCode: 404,
      });
    }
  }
}

export async function checkScheduleLengthAndDay(schedules, startDate, endDate) {
  // 여행일정과 관련된 변수 설정
  const singleScheduleLength = schedules.length;

  // startDate, endDate Date로 변경
  const stDate = new Date(startDate);
  const edDate = new Date(endDate);

  // 여행일정 수 계산 (5월 30일 ~ 6월 2일이여도 계산 가능)
  const dtMs = edDate.getTime() - stDate.getTime();
  const travelDays = dtMs / (1000 * 60 * 60 * 24) + 1;

  // 등록된 여행 날짜와 디데이 불일치
  if (singleScheduleLength !== travelDays) {
    throw new CustomError(commonError.SCHEDULE_MATCH_ERROR, '등록된 여행 날짜와 여행 일정 수가 일치하지 않습니다', {
      statusCode: 404,
    });
  }
}

export async function checkSchedulePlaceAndDistances(schedules, distances) {
  // 세부 장소와 거리에 관련된 변수 설정
  const singleSchedulePlaceCounts = schedules.map((location) => location.length - 1);
  const distancesCounts = distances.map((distance) => distance.length);

  //세부 장소와 거리 갯수 불일치 시 오류 반환
  if (singleSchedulePlaceCounts.length !== distancesCounts.length) {
    throw new CustomError(commonError.SCHEDULE_MATCH_ERROR, '등록된 여행 장소 갯수와 거리 갯수가 일치하지 않습니다.', {
      statusCode: 404,
    });
  }
}