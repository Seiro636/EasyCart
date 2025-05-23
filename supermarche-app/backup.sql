PGDMP  (                    }           db    17.2    17.2 <    7           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            8           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            9           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            :           1262    16388    db    DATABASE     u   CREATE DATABASE db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'French_France.1252';
    DROP DATABASE db;
                     postgres    false            �            1259    16527    listes_de_courses    TABLE     �   CREATE TABLE public.listes_de_courses (
    list_id integer NOT NULL,
    user_id integer,
    product_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_taken boolean
);
 %   DROP TABLE public.listes_de_courses;
       public         heap r       postgres    false            �            1259    16526    listes_de_courses_list_id_seq    SEQUENCE     �   CREATE SEQUENCE public.listes_de_courses_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.listes_de_courses_list_id_seq;
       public               postgres    false    228            ;           0    0    listes_de_courses_list_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.listes_de_courses_list_id_seq OWNED BY public.listes_de_courses.list_id;
          public               postgres    false    227            �            1259    16403    magasin    TABLE     �   CREATE TABLE public.magasin (
    magasin_id integer NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255)
);
    DROP TABLE public.magasin;
       public         heap r       postgres    false            �            1259    24720    magasin_sections    TABLE     �   CREATE TABLE public.magasin_sections (
    section_id integer NOT NULL,
    magasin_id integer,
    grid_position character varying(10) NOT NULL,
    category_name character varying(255) NOT NULL,
    rayon_id integer
);
 $   DROP TABLE public.magasin_sections;
       public         heap r       postgres    false            �            1259    24719    magasin_sections_section_id_seq    SEQUENCE     �   CREATE SEQUENCE public.magasin_sections_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.magasin_sections_section_id_seq;
       public               postgres    false    230            <           0    0    magasin_sections_section_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.magasin_sections_section_id_seq OWNED BY public.magasin_sections.section_id;
          public               postgres    false    229            �            1259    16428    produits    TABLE     �   CREATE TABLE public.produits (
    product_id integer NOT NULL,
    name character varying(255) NOT NULL,
    rayon_id integer
);
    DROP TABLE public.produits;
       public         heap r       postgres    false            �            1259    16427    produits_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.produits_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.produits_product_id_seq;
       public               postgres    false    224            =           0    0    produits_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.produits_product_id_seq OWNED BY public.produits.product_id;
          public               postgres    false    223            �            1259    16508    rayon_supermarchés    TABLE     �   CREATE TABLE public."rayon_supermarchés" (
    "rayon_supermarchés_id" integer NOT NULL,
    supermarket_id integer,
    rayon_id integer,
    "position" integer
);
 )   DROP TABLE public."rayon_supermarchés";
       public         heap r       postgres    false            �            1259    16507 .   rayon_supermarchés_rayon_supermarchés_id_seq    SEQUENCE     �   CREATE SEQUENCE public."rayon_supermarchés_rayon_supermarchés_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 G   DROP SEQUENCE public."rayon_supermarchés_rayon_supermarchés_id_seq";
       public               postgres    false    226            >           0    0 .   rayon_supermarchés_rayon_supermarchés_id_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public."rayon_supermarchés_rayon_supermarchés_id_seq" OWNED BY public."rayon_supermarchés"."rayon_supermarchés_id";
          public               postgres    false    225            �            1259    16414    rayons    TABLE     h   CREATE TABLE public.rayons (
    rayon_id integer NOT NULL,
    name character varying(255) NOT NULL
);
    DROP TABLE public.rayons;
       public         heap r       postgres    false            �            1259    16413    rayons_rayon_id_seq    SEQUENCE     �   CREATE SEQUENCE public.rayons_rayon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.rayons_rayon_id_seq;
       public               postgres    false    222            ?           0    0    rayons_rayon_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.rayons_rayon_id_seq OWNED BY public.rayons.rayon_id;
          public               postgres    false    221            �            1259    16402    supermarches_supermarket_id_seq    SEQUENCE     �   CREATE SEQUENCE public.supermarches_supermarket_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.supermarches_supermarket_id_seq;
       public               postgres    false    220            @           0    0    supermarches_supermarket_id_seq    SEQUENCE OWNED BY     Z   ALTER SEQUENCE public.supermarches_supermarket_id_seq OWNED BY public.magasin.magasin_id;
          public               postgres    false    219            �            1259    16390    utilisateurs    TABLE     o  CREATE TABLE public.utilisateurs (
    user_id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(20) DEFAULT 'user'::character varying
);
     DROP TABLE public.utilisateurs;
       public         heap r       postgres    false            �            1259    16389    utilisateurs_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.utilisateurs_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.utilisateurs_user_id_seq;
       public               postgres    false    218            A           0    0    utilisateurs_user_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.utilisateurs_user_id_seq OWNED BY public.utilisateurs.user_id;
          public               postgres    false    217            }           2604    16530    listes_de_courses list_id    DEFAULT     �   ALTER TABLE ONLY public.listes_de_courses ALTER COLUMN list_id SET DEFAULT nextval('public.listes_de_courses_list_id_seq'::regclass);
 H   ALTER TABLE public.listes_de_courses ALTER COLUMN list_id DROP DEFAULT;
       public               postgres    false    227    228    228            y           2604    16406    magasin magasin_id    DEFAULT     �   ALTER TABLE ONLY public.magasin ALTER COLUMN magasin_id SET DEFAULT nextval('public.supermarches_supermarket_id_seq'::regclass);
 A   ALTER TABLE public.magasin ALTER COLUMN magasin_id DROP DEFAULT;
       public               postgres    false    220    219    220                       2604    24723    magasin_sections section_id    DEFAULT     �   ALTER TABLE ONLY public.magasin_sections ALTER COLUMN section_id SET DEFAULT nextval('public.magasin_sections_section_id_seq'::regclass);
 J   ALTER TABLE public.magasin_sections ALTER COLUMN section_id DROP DEFAULT;
       public               postgres    false    230    229    230            {           2604    24718    produits product_id    DEFAULT     z   ALTER TABLE ONLY public.produits ALTER COLUMN product_id SET DEFAULT nextval('public.produits_product_id_seq'::regclass);
 B   ALTER TABLE public.produits ALTER COLUMN product_id DROP DEFAULT;
       public               postgres    false    223    224    224            |           2604    16511 *   rayon_supermarchés rayon_supermarchés_id    DEFAULT     �   ALTER TABLE ONLY public."rayon_supermarchés" ALTER COLUMN "rayon_supermarchés_id" SET DEFAULT nextval('public."rayon_supermarchés_rayon_supermarchés_id_seq"'::regclass);
 ]   ALTER TABLE public."rayon_supermarchés" ALTER COLUMN "rayon_supermarchés_id" DROP DEFAULT;
       public               postgres    false    225    226    226            z           2604    16417    rayons rayon_id    DEFAULT     r   ALTER TABLE ONLY public.rayons ALTER COLUMN rayon_id SET DEFAULT nextval('public.rayons_rayon_id_seq'::regclass);
 >   ALTER TABLE public.rayons ALTER COLUMN rayon_id DROP DEFAULT;
       public               postgres    false    222    221    222            u           2604    16393    utilisateurs user_id    DEFAULT     |   ALTER TABLE ONLY public.utilisateurs ALTER COLUMN user_id SET DEFAULT nextval('public.utilisateurs_user_id_seq'::regclass);
 C   ALTER TABLE public.utilisateurs ALTER COLUMN user_id DROP DEFAULT;
       public               postgres    false    218    217    218            2          0    16527    listes_de_courses 
   TABLE DATA           _   COPY public.listes_de_courses (list_id, user_id, product_id, created_at, is_taken) FROM stdin;
    public               postgres    false    228   �K       *          0    16403    magasin 
   TABLE DATA           <   COPY public.magasin (magasin_id, name, address) FROM stdin;
    public               postgres    false    220   L       4          0    24720    magasin_sections 
   TABLE DATA           j   COPY public.magasin_sections (section_id, magasin_id, grid_position, category_name, rayon_id) FROM stdin;
    public               postgres    false    230   �L       .          0    16428    produits 
   TABLE DATA           >   COPY public.produits (product_id, name, rayon_id) FROM stdin;
    public               postgres    false    224   �X       0          0    16508    rayon_supermarchés 
   TABLE DATA           o   COPY public."rayon_supermarchés" ("rayon_supermarchés_id", supermarket_id, rayon_id, "position") FROM stdin;
    public               postgres    false    226   (f       ,          0    16414    rayons 
   TABLE DATA           0   COPY public.rayons (rayon_id, name) FROM stdin;
    public               postgres    false    222   Ef       (          0    16390    utilisateurs 
   TABLE DATA           c   COPY public.utilisateurs (user_id, email, password_hash, created_at, updated_at, role) FROM stdin;
    public               postgres    false    218   g       B           0    0    listes_de_courses_list_id_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('public.listes_de_courses_list_id_seq', 37, true);
          public               postgres    false    227            C           0    0    magasin_sections_section_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.magasin_sections_section_id_seq', 567, true);
          public               postgres    false    229            D           0    0    produits_product_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.produits_product_id_seq', 384, true);
          public               postgres    false    223            E           0    0 .   rayon_supermarchés_rayon_supermarchés_id_seq    SEQUENCE SET     _   SELECT pg_catalog.setval('public."rayon_supermarchés_rayon_supermarchés_id_seq"', 1, false);
          public               postgres    false    225            F           0    0    rayons_rayon_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.rayons_rayon_id_seq', 16, true);
          public               postgres    false    221            G           0    0    supermarches_supermarket_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.supermarches_supermarket_id_seq', 34, true);
          public               postgres    false    219            H           0    0    utilisateurs_user_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.utilisateurs_user_id_seq', 4, true);
          public               postgres    false    217            �           2606    16533 (   listes_de_courses listes_de_courses_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.listes_de_courses
    ADD CONSTRAINT listes_de_courses_pkey PRIMARY KEY (list_id);
 R   ALTER TABLE ONLY public.listes_de_courses DROP CONSTRAINT listes_de_courses_pkey;
       public                 postgres    false    228            �           2606    24725 &   magasin_sections magasin_sections_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.magasin_sections
    ADD CONSTRAINT magasin_sections_pkey PRIMARY KEY (section_id);
 P   ALTER TABLE ONLY public.magasin_sections DROP CONSTRAINT magasin_sections_pkey;
       public                 postgres    false    230            �           2606    16435    produits produits_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.produits
    ADD CONSTRAINT produits_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.produits DROP CONSTRAINT produits_pkey;
       public                 postgres    false    224            �           2606    16513 ,   rayon_supermarchés rayon_supermarchés_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."rayon_supermarchés"
    ADD CONSTRAINT "rayon_supermarchés_pkey" PRIMARY KEY ("rayon_supermarchés_id");
 Z   ALTER TABLE ONLY public."rayon_supermarchés" DROP CONSTRAINT "rayon_supermarchés_pkey";
       public                 postgres    false    226            �           2606    16421    rayons rayons_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.rayons
    ADD CONSTRAINT rayons_pkey PRIMARY KEY (rayon_id);
 <   ALTER TABLE ONLY public.rayons DROP CONSTRAINT rayons_pkey;
       public                 postgres    false    222            �           2606    16412    magasin supermarches_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.magasin
    ADD CONSTRAINT supermarches_pkey PRIMARY KEY (magasin_id);
 C   ALTER TABLE ONLY public.magasin DROP CONSTRAINT supermarches_pkey;
       public                 postgres    false    220            �           2606    16401 #   utilisateurs utilisateurs_email_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_key UNIQUE (email);
 M   ALTER TABLE ONLY public.utilisateurs DROP CONSTRAINT utilisateurs_email_key;
       public                 postgres    false    218            �           2606    16399    utilisateurs utilisateurs_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (user_id);
 H   ALTER TABLE ONLY public.utilisateurs DROP CONSTRAINT utilisateurs_pkey;
       public                 postgres    false    218            �           2606    16539 3   listes_de_courses listes_de_courses_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.listes_de_courses
    ADD CONSTRAINT listes_de_courses_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.produits(product_id);
 ]   ALTER TABLE ONLY public.listes_de_courses DROP CONSTRAINT listes_de_courses_product_id_fkey;
       public               postgres    false    4745    224    228            �           2606    16534 0   listes_de_courses listes_de_courses_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.listes_de_courses
    ADD CONSTRAINT listes_de_courses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.utilisateurs(user_id);
 Z   ALTER TABLE ONLY public.listes_de_courses DROP CONSTRAINT listes_de_courses_user_id_fkey;
       public               postgres    false    218    228    4739            �           2606    24726 1   magasin_sections magasin_sections_magasin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.magasin_sections
    ADD CONSTRAINT magasin_sections_magasin_id_fkey FOREIGN KEY (magasin_id) REFERENCES public.magasin(magasin_id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.magasin_sections DROP CONSTRAINT magasin_sections_magasin_id_fkey;
       public               postgres    false    230    4741    220            �           2606    16436    produits produits_rayon_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.produits
    ADD CONSTRAINT produits_rayon_id_fkey FOREIGN KEY (rayon_id) REFERENCES public.rayons(rayon_id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.produits DROP CONSTRAINT produits_rayon_id_fkey;
       public               postgres    false    222    224    4743            �           2606    16519 5   rayon_supermarchés rayon_supermarchés_rayon_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."rayon_supermarchés"
    ADD CONSTRAINT "rayon_supermarchés_rayon_id_fkey" FOREIGN KEY (rayon_id) REFERENCES public.rayons(rayon_id) ON DELETE CASCADE;
 c   ALTER TABLE ONLY public."rayon_supermarchés" DROP CONSTRAINT "rayon_supermarchés_rayon_id_fkey";
       public               postgres    false    4743    226    222            �           2606    16514 ;   rayon_supermarchés rayon_supermarchés_supermarket_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."rayon_supermarchés"
    ADD CONSTRAINT "rayon_supermarchés_supermarket_id_fkey" FOREIGN KEY (supermarket_id) REFERENCES public.magasin(magasin_id) ON DELETE CASCADE;
 i   ALTER TABLE ONLY public."rayon_supermarchés" DROP CONSTRAINT "rayon_supermarchés_supermarket_id_fkey";
       public               postgres    false    4741    220    226            2   Q   x�mʱ� ��py�������6W_��5B�צ� i���t�x���)avB2��~ūFQ����]���-�� �'      *   �   x�eP[j�0��9Ş���<�����,&1l��ąܾ��5��H3��`��� ��v%IAeװ��u��p�iK;Ǘ%���{E��kK���R�Ү�=R=&P,˺�`]�y)#�OS'P�b.�x����p�j�`!���l��{���9[P{�R��)�u�@�3rD�tW<��ఁ�NQ�{n��z�I>^�����_���_���      4   �  x�}ZK��\�>� XL&�Kk��cc��Φ-44H-CR/|_�+�}1�%�HA��E0�L�k�ѭ��oϟ�=������?�by�X�2cI�}�bз(}�`������ϟ?>��yºas;
�ynHd-�Fk	 ��-�y=�d �������W�{S��[���|}�����
��������O��<�?y�j)W�\T��9V�I��˂�0$&
F3V�3�B:Ϙ���~���˅2��d4rm��ko8�6����;\��a�M4����� ��%SN�E���QR�q^QR�q^PR]	0�����)���}UK[��,T�ۖU�<T�[���Q h��М9i;�[�`U0�ui 4�B6bJPnmB1U�,*o��Eun���6H΢@r��YT/$gQ���E�BrV�	�YU�.9k4r�Le#���d�ڛ��\�S���;�8�SU6&g���`��P3吜�CrJ�P�Жp� �-a"�ć�в*!�T"�rk�r�.1�-$[�z'%:�\�dw}��&t��o¼�r��n�!л��H�f�:��N��C�S0��Sۡ(&s��F��@7zm����k5؍^ۨao�l$vI
}�!-4�;�?�݀� r =HJ"�.�*��ӛ3�����@ԭ-� ��E4*Zp\6�&[�f�� "�%�֗D�L�h�7�BѴor����d!6g [��Hb� ���60_شc��i�|aӺ�nNo|�������8��鍕���Rt,Nf�%_Rv�L�a�3��/�]�|�襈�"E�����(d�7�Ё`�Ն��ܥJ�\������P|I���=��vi�X���Ћ�P\UT[��ˡ��|��$KZ}:m�)U�ћ���U:�g�ˮw2���4�]��Z����?z~�2^m�f�0�~������/��vIMdTZP�T^Pѩ���(x�G-����V���yԀ�� �a�9�ț@־�f��D'��E���.ݼ����`�ќ��K������s_�@� ՛h��v�/��X��.���S��x<�"��&J��C�N'��u�x�ߊ��x���g4����%�%_>a������	+���m���U<�wY�=��n%�6},�[���8Ŷ��?�z|����ߞ�~z���|5^��I��e0�}��Mo�b��M�֭�E������q�vy,Z7���� ��ؕ�%Q��K8�=	�RvC�[W�P2т#a �^[�	k���q�w>nM;O��%^���ұ����֚�X��]�X�t7����x[�Drʨ��V����DZ������FEz��K@C����=۔�z���
�b��o+���QM	�@=pT?F^wݛ�9����IώxyTv����-v��X�8L�!1�1�L6~���7�g��{����߬r�*������$϶�+l,��؃V����Z��le�{7��͉�Qh.�����ᅧb"�|��i�{D�� 	��"_�n��W��\�&��i�<�쏨����)ŕnv69��b�����o2����-4p�KP�S�H��æ�������l�-������%��Z|E��EnU����W��e���6B@X�#m��p2�#\|��<�m0�}�xB)��(�;�
(�=��P1� "����ӗ�`-(�3Z͂�t/[4��`�)(���r8��B�z��ƕ #dKn��?>}~�����<�S����S�-�Z��p�ZGxr$G�,>Gf�y�4��[N �.����������	�]�8ܻ2<������ Nü��u;��v|u1���6�\�>�\�����,������y��������+e��qQ'p���L��O��H��'��O��c��� ����uNcB���Oc�3��	��}ˈ|�3��!���<"�v�\҈�}�<�aߢ�xܷC��t�rHQ~u����^��	+N�ޯ.8�V\�ڂ��o�%�`��~����G��c�ǔ�;�/x��ˤ��Ҁ�J��q�����Ri���~N��<pQPoϋOR�	>I��7�lߕ�+JB�m$����Ͳ)���~uFR�
˔"\��,�ЄZ/S��2����tE�$-�2�%iAUpԤ�Z����T��צ]Q�J+��SyɎ��{:N�UO���v &A��8��5J���~xĹbt�g�~ �vH�޳	��-���-'���S1�8z�85�O�\�R��Q�/���b��ϳɅ�^|�i�jp���$ {������?���@�\6�R�&�+zj~����{R��1��E��Nr[

��]9����)�|QF�_��$�����r[
XV�te.�*�ܛ6дkriZ�xm}�#�\N�$W��}�_��"{�y��V�gx����=�ۃk�=�`7P/S�է0#Loj�,�5ؔ���%�!⻸�ە�Î1�OW��i��q�s�&p� ���dQdw�ix����hC�ph�A��4H� ���
2���ס`QY��P���P��{
V�UA'Wp.�S��	d�U�$y�Ӑ���]�2�����/_E��uȘ�6V?�}����]aD玧�;��ǰ���9��9$w�Mjs����p�:�i'�9��Ό��΄R��ꉆ;;>wv<wv�H��;'Svp��2�L��k��0uض��pnA�a�P�i>��S�r�=�i���}:_=9��&�G�/�#ԑB�'?� �# �c���$s(O(|����#��P������ұX��r/w��?}�p��xY�c��=([~\�&!�~����Xp)B�qS
�ZH:.�χ�?R���DNGN�	=r�`�ӷ�Xp߲b�eÂ�G������`��|,b��c�H�i�|�l�aT4���*l*�sn��t��q:uJ�WV�С��cu�*�B�NG����<*�b���>j��4X�������S�^      .   {  x�eY�n�]S_Q��U�{)Y~�#�ۘA�l�����b�U�cy�m��*Y��YL>��|��$���j�䅍�,���>ΥF��yi�eh�ee���'��t���0���^�X;A����h� �b �}��˿�Mώ>����id�in�ھ�mQ�d�iq�}��ʬ�D22oB��q�+�"��<�	��ݧsbgW��t��y��_��l�n3{����q%��y���wP]�zk7I��A�h����?:��Ύ�Y�hn��0�q�W�ǒ�n��e62�_�&k�����p9��9oV�O�4l&�}�VE�"�Y�������8@�f�$l����8��~:��U�����<�P$����-b��&��|d^�g۷�76�+��V�edp]aF'c��ڵ���\I��¼����F��m�ܾ�bP������y�������������2��g�`��3�'g��6v4�ss�*�`R�m����W��\C�4�^������/^~B����'.����2�2t2Z���5p\�0�|ZA�@��AF8�������Q`c��h������)�3a431���2�3~�O����Q^|S�z�k8��o�Pܙ�tK��^��8���s�,~���G�v.v"�n7���h/>�.n�0���w��\����8Z��|��<8���%����K��04A�;hC�����h_|���S��:]�AW�����')�fq%)�t[v=9�C7�%�Ո| �`��m���dq�`�-b�HN+�Lrm�3aKq|H
�k����-Y���}�?s0�|���]���J�������>�~j�!�d�����.��w� eA.�Naa:�λ��= �G�=� �m\b_��ٙyn�d�Y��g��IjӜ��6�@Ž�1�3aD��t�$�	66o\�7�!��a�:�7��ǖ������\���tٙ���kl�Շx&>GТ>8q3��/��a~�V�:�y�;��ې�;n
Y/"�6.��_�P�����"��@��z�Af�j�u'�	|�G��X�?m]%�e��gQ�� �Q�+�Q��p�!���;ݳ83O�8Mge�"?�Ŋs�V5
�e)C�R���OA�c=�贿+q�u�`rXQ|C�)�{��v��nkY@�h�?�~������߰(�Q`d�N�;Bҵmi�64��'qIV V�je���o�NW�>"oe�o_�y�#�l�sd��-�"ض���6�Zs�插R�2UV��b,��
�c]��A�8!Gn��-+�w�\ka"Ja��ѕs��k�3)]R��w��y���A�#���	�Wtlކ�䪵�'��~�9l�3�G�Ǟ)L�݃��H���m�"����z�.#���y/iy~R��E$Aa�WB����k}Ʉ$��Ra�,r�>4^�N���"���H�G9���~4A�d�f+�oo��+�({}�:G����li[�Oo@�i����B��TYB�4B�����	=��3�(�ӎ�Y�7bk�^�	�1�u[�Y���ŝ���଩�q
҅���%]���I��y���N����$}�ۆJ8���h!� �J�% �C��慃�i��a�@E _=�y%_��H$�Ɉ��YF��@��.m��Τ�I�o�[�p�Id43�x�c�-�U��UL�/��0�1+�Xo!(P��	�㑻�o�D�Yv�^$�}g�Đ��֞i\(}��"C��x_�ڥD���T��&�N���A���%��e���4�'XS�����`r�T�KŨ]WnG��_ji��pb��ꢆ�AA$��Ǫ8S��CZ)�(i����Dj���S��~�n�k�"�ǰ?��`´9 ҆��	j�-mxd��UECZ	�s�`�۪�'焁�� ��P���}Cn�J�%���$:����0�Ƙ�LzEg��ׁ�]�pS��G-̻ �eP����;�U��ZQa�Wɠ��B��F}B<i.P`,zn�g'-��n�A��B�X��ݐ� ��
%�����1���pG.�H_⛴�BM�4�6>S�p�7
�k�\	���֒��h�~���[������������p/.�F��Ĳt 8ć	��Oa�A->��!���2GcJqR��;4 ���E���3eg��K�Հ#�÷���������aye��HD��0����r�����a�)�Yf�2`y&z Μ���w]����r�c~����"�õ6����W��3��<���o$O�.-U1G��SZ�����8?���-ʙW�ps���8�5Lm�S�e{؛�9�kQ�z)ȕ?R�-~G�]�%�w�`X����)�W|f~r,��'�G�h!�=ؔ\��G'��%����)·�
��L,���.��:Ex��t����#قt�"�l��6�&}��]��ࣴǔ֥��dF����켔8���۩=���*G)�3N��=b�ʹHjb�+l�-v��DA~$X�F�^���ZX8)*u��{��q�%��!Tp�x�u2*���i�����O �����:U0��44�zbS�0���@v���=7�^������BR�%�ES^�'łE=��A	� '���$c6Q[��`>=�F=� ���4���R��}�|L'��*�	??QpB��:o�E�s��4����B��g����6z�ǭ����R*�j2"��	#��y����Bl��[Ҍ��%�0�H l1c�<e�*�#�Jo]�2�P+����Ȕ�9��*iW��
�[-mUZ���"i�v5( c�F{�5;�P�M�Ԥezn$�>�=T�9�"�?�7�c���H��v+�L�E��.V�1)*�#bT�(b�!�#���0�̾�r|���8�)�7gc��k&6�d\�U�m{�2�f)Z�^�e�2�:�����A	)�f��� `Y(D����Z2X[�kV���y%	���
�
���Y�L���9�|j��C�L���@`��-q�V�we��;맖;ɧh�k�z�ia���>Y��M�-s�:\�"J�<�փ�/d��ͮ�^�|z2Ik��4�d)����)3�A	c��B�E�&���Y�A�:�>��=�i%���ļ�R�X��&4�NaI)���o��f�]��,���+��ȶ��?V
�[�8��A&��
��g��<����s��$elr־�N^�DX��h ��/*�)��F�E�U��}��Oĉpn>w��d ���憃%��+�ui�xl�L*�살BS&q2����A� V�ߡj�K޽������A�F����89'�}�.9a����k1��s�!��L]��<��f�*&'�F�?��w�[�#Z�������d5�9��sE$Mo���wy^��ǏRH����z4��� �(�^F ���Y��\A*9f��N_�R|�-l�� g��3>��ONN����       0      x������ � �      ,   �   x�U�;
�@E��V�
��Z1X$�� c�d"�)\�۰2똍9I-﹗Í W���
7���8IT�mHk���-�V��s���׃��X��#�l��l�f� �a�Y�onD��ْ�Hd�[3���(aHHd	�%���d�R(9y�P-69)�?r5��]�粺�\5�,�����fV�      (   E  x�u�Ko�@��5�
nf��V�(-��n�

� P��7%&�M؜����CL��0A�3c�/9X�̵�8�9^`"A��m�){1�KW��~����g1o�SC,L �`<�T��E@yq�7רb������{!�j�GbgNaykj��sHnY�;�4�^�@��͏����;�,P��4�{�����</���eS���в�V7[��͉o����
�Qg�:"W%�H�~%i�DBC N���/ ����,���y��"Z��Ɵ�q���Z\Yݡ[�ۻ���o��g�nv�]?��0At����,`��;�e�}��     