/**
 * Character Registry for Desk Racer.
 * Defines the 5 cute animal drivers available for the micro go-kart.
 */
export const CHARACTER_DEFINITIONS = [
  {
    id: 'siamese',
    name: 'Siamese Cat',
    nameKr: '샴 고양이',
    icon: '🐱',
    badge: 'CAT',
    badgeColor: '#00e5ff',
    tagline: 'Agile Seal-Point Racer',
    taglineKr: '우아한 사파이어 눈동자와 빈티지 고글의 클래식 샴 고양이',
    description: 'Quick reflexes and sharp eyes. Features seal-point fur, retro brass goggles, and an articulated swishing tail.',
    descriptionKr: '책상 서킷의 오리지널 챔피언! 짙은 초콜릿색 마스크와 반짝이는 사파이어 블루 눈동자, 빈티지 황동 고글을 쓴 재빠른 고양이 레이서입니다.',
  },
  {
    id: 'shiba',
    name: 'Shiba Inu',
    nameKr: '시바견',
    icon: '🐕',
    badge: 'DOG',
    badgeColor: '#ff9900',
    tagline: 'Spirited Shiba Pilot',
    taglineKr: '귀 쫑긋! 통통한 볼살과 도넛 꼬리의 명랑한 시바견',
    description: 'Enthusiastic and joyful racer with golden-tan fur, white cheeks, perky triangular ears, and a cute curled tail.',
    descriptionKr: '호기심 가득한 눈망울과 통통한 흰 볼살, 쫑긋 세운 세모 귀와 돌돌 말린 도넛 꼬리가 매력적인 에너지 넘치는 시바견 드라이버입니다.',
  },
  {
    id: 'otter',
    name: 'Baby Otter',
    nameKr: '아기 수달',
    icon: '🦦',
    badge: 'OTTER',
    badgeColor: '#38bdf8',
    tagline: 'Smooth Stream Drifter',
    taglineKr: '물살을 가르듯 코너를 매끄럽게 미끄러지는 귀염뽀짝 아기 수달',
    description: 'Master of water slide lines. Streamlined chestnut fur, cute rounded ears, whiskered muzzle, and thick rudder tail.',
    descriptionKr: '물놀이하듯 부드럽게 코너를 공략하는 수달 드라이버! 앙증맞은 동글동글 귀와 통통한 주둥이, 코너링 시 부드럽게 방향을 잡아주는 꼬리가 돋보입니다.',
  },
  {
    id: 'retriever',
    name: 'Golden Retriever',
    nameKr: '골든 리트리버',
    icon: '🐶',
    badge: 'PUPPY',
    badgeColor: '#eab308',
    tagline: 'Sunny Floppy-Eared Pup',
    taglineKr: '바람에 큰 귀를 펄럭이며 해맑게 웃는 순둥이 리트리버',
    description: 'Pure joy on wheels! Warm golden cream coat, large floppy ears flapping in the wind, happy open smile, and wagging bushy tail.',
    descriptionKr: '달릴 때마다 커다란 귀가 바람에 펄럭이는 사랑스러운 댕댕이! 해맑게 벌린 입과 분홍 혀, 멈추지 않고 신나게 살랑이는 꼬리가 힐링을 선사합니다.',
  },
  {
    id: 'panda',
    name: 'Baby Panda',
    nameKr: '아기 판다',
    icon: '🐼',
    badge: 'PANDA',
    badgeColor: '#a855f7',
    tagline: 'Chubby Bamboo Racer',
    taglineKr: '동글동글 까만 귀와 듬직한 볼살의 대나무 사랑꾼 아기 판다',
    description: 'Lovable rounded silhouette with classic black-and-white fur, bouncing button ears, sweet dark eye patches, and round tail.',
    descriptionKr: '동글동글한 얼굴에 귀여운 까만 귀, 듬직한 체구와 대나무 잎 장식이 돋보이는 느긋하지만 든든한 레이서 아기 판다입니다.',
  },
];

export function getCharacterDefinition(characterId) {
  return (
    CHARACTER_DEFINITIONS.find((c) => c.id === characterId) ||
    CHARACTER_DEFINITIONS[0]
  );
}

export function getAllCharacters() {
  return CHARACTER_DEFINITIONS;
}
