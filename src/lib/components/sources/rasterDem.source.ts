import { createCommentVNode, defineComponent, inject, PropType, provide } from 'vue';
import { AllSourceOptions, componentIdSymbol, sourceIdSymbol, sourceLayerRegistry } from '@/lib/types';
import { RasterDEMSourceSpecification, RasterDEMTileSource } from 'maplibre-gl';
import { SourceLayerRegistry } from '@/lib/lib/sourceLayer.registry';
import { SourceLib } from '@/lib/lib/source.lib';
import { useSource } from '@/lib/composable/useSource';
import { SlotsType } from 'vue/dist/vue';

const sourceOpts = AllSourceOptions<RasterDEMSourceSpecification>({
	url        : undefined,
	tiles      : undefined,
	bounds     : undefined,
	minzoom    : undefined,
	maxzoom    : undefined,
	tileSize   : undefined,
	attribution: undefined,
	encoding   : undefined,
	volatile   : undefined,
	redFactor  : undefined,
	blueFactor : undefined,
	greenFactor: undefined,
	baseShift  : undefined
});


export default /*#__PURE__*/ defineComponent({
	name : 'MglRasterDemSource',
	props: {
		sourceId   : {
			type    : String as PropType<string>,
			required: true
		},
		url        : String as PropType<string>,
		tiles      : Array as PropType<string[]>,
		bounds     : Array as PropType<number[]>,
		minzoom    : Number as PropType<number>,
		maxzoom    : Number as PropType<number>,
		tileSize   : Number as PropType<number>,
		attribution: String as PropType<string>,
		encoding   : String as PropType<'terrarium' | 'mapbox'>,
		volatile   : Boolean
	},
	slots: Object as SlotsType<{ default: {} }>,
	setup(props, { slots }) {

		const cid      = inject(componentIdSymbol)!,
			  source   = SourceLib.getSourceRef<RasterDEMTileSource>(cid, props.sourceId),
			  registry = new SourceLayerRegistry();

		provide(sourceIdSymbol, props.sourceId);
		provide(sourceLayerRegistry, registry);

		useSource<RasterDEMSourceSpecification>(source, props, 'raster-dem', sourceOpts, registry);

		return () => [
			createCommentVNode('RasterDem Source'),
			source.value && slots.default ? slots.default({}) : undefined
		];

	}
});
