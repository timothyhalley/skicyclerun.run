FasdUAS 1.101.10   ��   ��    k             l     ��  ��    - ' display dialog theOutputFolder as text     � 	 	 N   d i s p l a y   d i a l o g   t h e O u t p u t F o l d e r   a s   t e x t   
  
 l     ��  ��    Y S set theOutputFolder to choose folder with prompt "Please select an output folder:"     �   �   s e t   t h e O u t p u t F o l d e r   t o   c h o o s e   f o l d e r   w i t h   p r o m p t   " P l e a s e   s e l e c t   a n   o u t p u t   f o l d e r : "      l     ��  ��    * $ set dest to theOutputFolder as text     �   H   s e t   d e s t   t o   t h e O u t p u t F o l d e r   a s   t e x t      l     ��  ��    U O be sure to set Photo-->Preferences-->General-->Metadata:include GPS info, etc!     �   �   b e   s u r e   t o   s e t   P h o t o - - > P r e f e r e n c e s - - > G e n e r a l - - > M e t a d a t a : i n c l u d e   G P S   i n f o ,   e t c !      l     ��������  ��  ��        l     ��  ��    / ) direct path without clunky dialog boxes!     �   R   d i r e c t   p a t h   w i t h o u t   c l u n k y   d i a l o g   b o x e s !     !   l    $ "���� " O     $ # $ # k    # % %  & ' & l   �� ( )��   ( L F set currentDir to POSIX path of ((container of (path to me)) as text)    ) � * * �   s e t   c u r r e n t D i r   t o   P O S I X   p a t h   o f   ( ( c o n t a i n e r   o f   ( p a t h   t o   m e ) )   a s   t e x t ) '  + , + r     - . - n     / 0 / 1    ��
�� 
psxp 0 l    1���� 1 c     2 3 2 l    4���� 4 n     5 6 5 m   	 ��
�� 
ctnr 6 l   	 7���� 7 I   	�� 8��
�� .earsffdralis        afdr 8  f    ��  ��  ��  ��  ��   3 m    ��
�� 
ctxt��  ��   . o      ���� 0 
currentdir 
currentDir ,  9 : 9 r     ; < ; c     = > = c     ? @ ? o    ���� 0 
currentdir 
currentDir @ m    ��
�� 
psxf > m    ��
�� 
ctxt < o      ���� 0 currentdir2 currentDir2 :  A B A r     C D C m     E E � F F  P h o t o L i b : D o      ���� 0 photodir photoDir B  G�� G r    # H I H b    ! J K J o    ���� 0 currentdir2 currentDir2 K o     ���� 0 photodir photoDir I o      ���� 0 dest  ��   $ m      L L�                                                                                  MACS  alis    @  Macintosh HD               ߯#xBD ����
Finder.app                                                     ����߯#x        ����  
 cu             CoreServices  )/:System:Library:CoreServices:Finder.app/    
 F i n d e r . a p p    M a c i n t o s h   H D  &System/Library/CoreServices/Finder.app  / ��  ��  ��   !  M N M l     �� O P��   O 0 * display dialog "PWD PATH: " & currentDir3    P � Q Q T   d i s p l a y   d i a l o g   " P W D   P A T H :   "   &   c u r r e n t D i r 3 N  R S R l     ��������  ��  ��   S  T U T l     �� V W��   V � � set dest to "/Users/i850916/Projects/SkiCycleRun/PhotoLib/albums/" as POSIX file as text -- the destination folder (use a valid path)    W � X X   s e t   d e s t   t o   " / U s e r s / i 8 5 0 9 1 6 / P r o j e c t s / S k i C y c l e R u n / P h o t o L i b / a l b u m s / "   a s   P O S I X   f i l e   a s   t e x t   - -   t h e   d e s t i n a t i o n   f o l d e r   ( u s e   a   v a l i d   p a t h ) U  Y Z Y l     �� [ \��   [ %  display dialog "PATH: " & dest    \ � ] ] >   d i s p l a y   d i a l o g   " P A T H :   "   &   d e s t Z  ^ _ ^ l     ��������  ��  ��   _  ` a ` l  % � b���� b O   % � c d c k   ) � e e  f g f l  ) )��������  ��  ��   g  h i h I  ) .������
�� .miscactvnull��� ��� null��  ��   i  j k j l  / /��������  ��  ��   k  l m l r   / 6 n o n n   / 4 p q p 1   2 4��
�� 
pnam q 2  / 2��
�� 
IPal o o      ���� 0 l   m  r s r l  7 7��������  ��  ��   s  t u t r   7 L v w v I  7 H�� x y
�� .gtqpchltns    @   @ ns   x o   7 8���� 0 l   y �� z {
�� 
prmp z m   ; > | | � } } $ S e l e c t   s o m e   a l b u m s { �� ~��
�� 
mlsl ~ m   A B��
�� boovtrue��   w o      ���� 0 albnames albNames u   �  l  M M��������  ��  ��   �  � � � Z   M � � ����� � >  M R � � � o   M P���� 0 albnames albNames � m   P Q��
�� boovfals � l  U � � � � � k   U � � �  � � � l  U U��������  ��  ��   �  � � � r   U Z � � � m   U V����   � o      ���� 0 nval nVal �  � � � l  [ [��������  ��  ��   �  � � � X   [ � ��� � � k   q � � �  � � � l  q q��������  ��  ��   �  � � � r   q x � � � b   q t � � � o   q r���� 0 dest   � o   r s���� 0 tname tName � o      ���� 0 tfolder tFolder �  � � � l  y � � � � � n  y � � � � I   z ��� ����� 0 
makefolder 
makeFolder �  ��� � o   z }���� 0 tfolder tFolder��  ��   �  f   y z � ? 9 create a folder named (the name of this album) in dest      � � � � r   c r e a t e   a   f o l d e r   n a m e d   ( t h e   n a m e   o f   t h i s   a l b u m )   i n   d e s t     �  � � � l  � ��� � ���   � K E note: and using originals = HEIC, vs. without using originals = JPEG    � � � � �   n o t e :   a n d   u s i n g   o r i g i n a l s   =   H E I C ,   v s .   w i t h o u t   u s i n g   o r i g i n a l s   =   J P E G �  � � � l  � ��� � ���   � a [ export (get media items of album tName) to (tFolder as alias) with GPS and using originals    � � � � �   e x p o r t   ( g e t   m e d i a   i t e m s   o f   a l b u m   t N a m e )   t o   ( t F o l d e r   a s   a l i a s )   w i t h   G P S   a n d   u s i n g   o r i g i n a l s �  � � � r   � � � � � [   � � � � � o   � ����� 0 nval nVal � m   � �����  � o      ���� 0 nval nVal �  � � � t   � � � � � k   � � � �  � � � I  � ��� � �
�� .IPXSexponull���     **** � l  � � ����� � e   � � � � n   � � � � � 2  � ���
�� 
IPmi � 4   � ��� �
�� 
IPal � o   � ����� 0 tname tName��  ��   � �� � �
�� 
insh � l  � � ����� � c   � � � � � o   � ����� 0 tfolder tFolder � m   � ���
�� 
alis��  ��   � �� � ��� 
0 gps GPS � m   � ���
�� boovtrue � �� ���
�� 
usMA � m   � ���
�� boovfals��   �  ��� � I  � ��� ���
�� .ascrcmnt****      � **** � b   � � � � � b   � � � � � b   � � � � � m   � � � � � � �  E x p o r t :   � o   � ����� 0 tname tName � m   � � � � � � �    - -   � o   � ����� 0 nval nVal��  ��   � m   � �����X �  ��� � l  � ���������  ��  ��  ��  �� 0 tname tName � o   ^ a���� 0 albnames albNames �  ��� � l  � ���������  ��  ��  ��   �   not cancelled     � � � �    n o t   c a n c e l l e d  ��  ��   �  �� � l  � ��~�}�|�~  �}  �|  �   d m   % & � ��                                                                                  Phts  alis    0  Macintosh HD               ߯#xBD ����
Photos.app                                                     ����߯#x        ����  
 cu             Applications  !/:System:Applications:Photos.app/    
 P h o t o s . a p p    M a c i n t o s h   H D  System/Applications/Photos.app  / ��  ��  ��   a  � � � l     �{�z�y�{  �z  �y   �  � � � l     �x�w�v�x  �w  �v   �  � � � i      � � � I      �u ��t�u 0 
makefolder 
makeFolder �  ��s � o      �r�r 0 tpath tPath�s  �t   � k      � �  � � � l     �q�p�o�q  �p  �o   �  � � � l     � � � � I    �n ��m
�n .sysoexecTEXT���     TEXT � b      � � � m      � � � � �  m k d i r   - p   � n     � � � 1    �l
�l 
strq � n     � � � 1    �k
�k 
psxp � o    �j�j 0 tpath tPath�m   � $  with administrator privileges    � � � � <   w i t h   a d m i n i s t r a t o r   p r i v i l e g e s �  ��i � l   �h�g�f�h  �g  �f  �i   �  � � � l     �e�d�c�e  �d  �c   �    i     I      �b�a�b 0 
getnewname 
getNewName �` o      �_�_ 0 filein fileIn�`  �a   k     +  r     	
	 I    �^�]
�^ .sysoexecTEXT���     TEXT b      m      � ^ / u s r / b i n / m d l s   - n a m e   k M D I t e m C o n t e n t C r e a t i o n D a t e   n     1    �\
�\ 
strq n     1    �[
�[ 
psxp o    �Z�Z 0 filein fileIn�]  
 o      �Y�Y 0 xcmd xCmd  l    Z   �X�W =     o    �V�V 0 xcmd xCmd m     �  ( n u l l ) L     m       �!!  �X  �W     no tag error    �""    n o   t a g   e r r o r #�U# L    +$$ n    *%&% 7   )�T'(
�T 
ctxt' m   # %�S�S 
( m   & (�R�R��& n    )*) 4    �Q+
�Q 
cpar+ m    �P�P * o    �O�O 0 xcmd xCmd�U   ,�N, l     �M�L�K�M  �L  �K  �N       �J-./0�J  - �I�H�G�I 0 
makefolder 
makeFolder�H 0 
getnewname 
getNewName
�G .aevtoappnull  �   � ****. �F ��E�D12�C�F 0 
makefolder 
makeFolder�E �B3�B 3  �A�A 0 tpath tPath�D  1 �@�@ 0 tpath tPath2  ��?�>�=
�? 
psxp
�> 
strq
�= .sysoexecTEXT���     TEXT�C ��,�,%j OP/ �<�;�:45�9�< 0 
getnewname 
getNewName�; �86�8 6  �7�7 0 filein fileIn�:  4 �6�5�6 0 filein fileIn�5 0 xcmd xCmd5 	�4�3�2 �1�0�/
�4 
psxp
�3 
strq
�2 .sysoexecTEXT���     TEXT
�1 
cpar
�0 
ctxt�/ 
�9 ,��,�,%j E�O��  �Y hO��k/[�\[Z�\Zi2E0 �.7�-�,89�+
�. .aevtoappnull  �   � ****7 k     �::   ;;  `�*�*  �-  �,  8 �)�) 0 tname tName9 ' L�(�'�&�%�$�#�" E�!�  ������ |�����������������
�	 � ��
�( .earsffdralis        afdr
�' 
ctnr
�& 
ctxt
�% 
psxp�$ 0 
currentdir 
currentDir
�# 
psxf�" 0 currentdir2 currentDir2�! 0 photodir photoDir�  0 dest  
� .miscactvnull��� ��� null
� 
IPal
� 
pnam� 0 l  
� 
prmp
� 
mlsl� 
� .gtqpchltns    @   @ ns  � 0 albnames albNames� 0 nval nVal
� 
kocl
� 
cobj
� .corecnte****       ****� 0 tfolder tFolder� 0 
makefolder 
makeFolder�X
� 
IPmi
� 
insh
� 
alis� 
0 gps GPS
� 
usMA�
 
�	 .IPXSexponull���     ****
� .ascrcmnt****      � ****�+ �� !)j �,�&�,E�O��&�&E�O�E�O��%E�UO� �*j O*�-�,E�O�a a a ea  E` O_ f }jE` O o_ [a a l kh  ʠ%E` O)_ k+ O_ kE` Oa n*��/a -Ea _ a &a  ea !fa " #Oa $�%a %%_ %j &oOP[OY��OPY hOPUascr  ��ޭ